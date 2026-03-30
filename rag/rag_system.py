#!/usr/bin/env python3
"""
RAG System for Skills Documentation
벡터 DB를 생성하고 관리하는 시스템
"""

import os
import sys
import json
import hashlib
from pathlib import Path
from typing import List, Dict
from datetime import datetime

from langchain_community.document_loaders import DirectoryLoader, UnstructuredMarkdownLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

class SkillsRAG:
    """Skills 폴더 문서를 RAG화하는 클래스"""

    def __init__(self, skills_dir: str = "./skills", db_dir: str = "./.rag/chroma_db"):
        self.skills_dir = Path(skills_dir)
        self.db_dir = Path(db_dir)
        self.checksums_file = Path("./.rag/checksums.json")
        self._embeddings = None  # Lazy loading

        # 디렉토리 생성
        self.db_dir.parent.mkdir(parents=True, exist_ok=True)
        self.db_dir.mkdir(parents=True, exist_ok=True)

    @property
    def embeddings(self):
        """임베딩 모델을 lazy loading"""
        if self._embeddings is None:
            print("🔮 임베딩 모델 로딩 중... (최초 1회만, 약 10초 소요)")
            self._embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            print("✅ 임베딩 모델 로드 완료\n")
        return self._embeddings

    def calculate_file_hash(self, filepath: Path) -> str:
        """파일의 MD5 해시 계산"""
        hash_md5 = hashlib.md5()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def get_current_checksums(self) -> Dict[str, str]:
        """현재 skills 폴더의 모든 MD 파일 체크섬 계산"""
        checksums = {}
        for md_file in self.skills_dir.glob("*.md"):
            checksums[str(md_file)] = self.calculate_file_hash(md_file)
        return checksums

    def load_saved_checksums(self) -> Dict[str, str]:
        """저장된 체크섬 로드"""
        if self.checksums_file.exists():
            with open(self.checksums_file, 'r') as f:
                return json.load(f)
        return {}

    def save_checksums(self, checksums: Dict[str, str]):
        """체크섬 저장"""
        with open(self.checksums_file, 'w') as f:
            json.dump(checksums, f, indent=2)

    def needs_update(self) -> bool:
        """RAG DB 업데이트가 필요한지 확인"""
        current = self.get_current_checksums()
        saved = self.load_saved_checksums()

        # DB가 없으면 생성 필요
        if not self.db_dir.exists() or not list(self.db_dir.glob("*")):
            print("🔄 벡터 DB가 없습니다. 새로 생성합니다.")
            return True

        # 파일 개수가 다르면 업데이트 필요
        if len(current) != len(saved):
            print(f"📝 파일 개수 변경: {len(saved)} → {len(current)}")
            return True

        # 체크섬 비교
        for filepath, checksum in current.items():
            if saved.get(filepath) != checksum:
                print(f"📝 파일 변경 감지: {Path(filepath).name}")
                return True

        print("✅ Skills 문서 변경사항 없음")
        return False

    def create_vector_db(self):
        """벡터 DB 생성"""
        print("\n" + "="*60)
        print("🚀 RAG 벡터 DB 생성 시작")
        print("="*60)

        # 1. 문서 로드
        print("\n📂 문서 로딩 중...")
        loader = DirectoryLoader(
            str(self.skills_dir),
            glob="**/*.md",
            loader_cls=UnstructuredMarkdownLoader,
            show_progress=True
        )
        documents = loader.load()
        print(f"✅ {len(documents)}개 문서 로드 완료")

        # 2. 텍스트 분할
        print("\n✂️  텍스트 청크로 분할 중...")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n## ", "\n### ", "\n\n", "\n", " "],
            length_function=len,
        )
        chunks = text_splitter.split_documents(documents)
        print(f"✅ {len(chunks)}개 청크 생성 완료")

        # 3. 메타데이터 추가
        for i, chunk in enumerate(chunks):
            chunk.metadata['chunk_id'] = i
            chunk.metadata['source_file'] = Path(chunk.metadata.get('source', '')).name

        # 4. 벡터 DB 생성
        print("\n🔮 벡터 임베딩 생성 및 DB 저장 중...")
        print("   (로컬 임베딩 모델 사용 - 약 1분 소요)")

        vectordb = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=str(self.db_dir),
            collection_name="skills_docs"
        )

        # 5. 체크섬 저장
        current_checksums = self.get_current_checksums()
        self.save_checksums(current_checksums)

        # 통계 출력
        print("\n" + "="*60)
        print("✨ RAG 벡터 DB 생성 완료!")
        print("="*60)
        print(f"📊 통계:")
        print(f"   - 문서 개수: {len(documents)}개")
        print(f"   - 청크 개수: {len(chunks)}개")
        print(f"   - 저장 위치: {self.db_dir}")
        print(f"   - 예상 토큰 절감: {len(documents) * 7000} → {len(chunks) * 150} 토큰")
        print(f"   - 절감률: ~98%")
        print("="*60 + "\n")

        return vectordb

    def load_vector_db(self):
        """기존 벡터 DB 로드"""
        return Chroma(
            persist_directory=str(self.db_dir),
            embedding_function=self.embeddings,
            collection_name="skills_docs"
        )

    def search(self, query: str, k: int = 5) -> List[Dict]:
        """벡터 DB에서 검색"""
        vectordb = self.load_vector_db()
        results = vectordb.similarity_search_with_score(query, k=k)

        formatted_results = []
        for doc, score in results:
            formatted_results.append({
                'content': doc.page_content,
                'source': doc.metadata.get('source_file', 'Unknown'),
                'chunk_id': doc.metadata.get('chunk_id', 0),
                'score': float(score)
            })

        return formatted_results


def main():
    """메인 함수"""
    import argparse

    parser = argparse.ArgumentParser(description='Skills RAG System')
    parser.add_argument('--force', action='store_true', help='강제로 벡터 DB 재생성')
    parser.add_argument('--query', type=str, help='검색 쿼리')
    parser.add_argument('--top-k', type=int, default=5, help='검색 결과 개수')

    args = parser.parse_args()

    # RAG 시스템 초기화
    rag = SkillsRAG()

    # 업데이트 확인 및 생성
    if args.force or rag.needs_update():
        rag.create_vector_db()
    else:
        print("✅ RAG DB는 최신 상태입니다.\n")

    # 쿼리 실행
    if args.query:
        print("\n" + "="*60)
        print(f"🔍 검색: {args.query}")
        print("="*60 + "\n")

        results = rag.search(args.query, k=args.top_k)

        for i, result in enumerate(results, 1):
            print(f"\n[결과 {i}] {result['source']} (관련도: {1-result['score']:.3f})")
            print("-" * 60)
            print(result['content'][:300] + "...")
            print()


if __name__ == "__main__":
    main()
