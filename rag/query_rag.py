#!/usr/bin/env python3
"""
Claude + RAG 통합 쿼리 시스템
"""

import os
import sys
from typing import List, Dict
import anthropic
from dotenv import load_dotenv
from rag_system import SkillsRAG

load_dotenv()


class ClaudeRAGQuery:
    """Claude와 RAG를 통합한 쿼리 시스템"""

    def __init__(self):
        self.rag = SkillsRAG()
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY")
        )

    def query_with_rag(self, question: str, top_k: int = 5) -> str:
        """RAG를 사용하여 Claude에게 질문"""

        # 1. RAG 검색
        print(f"\n🔍 RAG 검색 중: '{question}'")
        results = self.rag.search(question, k=top_k)

        if not results:
            print("⚠️  관련 문서를 찾을 수 없습니다.")
            return "관련 문서를 찾을 수 없습니다."

        # 2. 컨텍스트 구성
        context_parts = []
        total_tokens = 0

        print(f"\n📚 관련 문서 {len(results)}개 발견:")
        for i, result in enumerate(results, 1):
            source = result['source']
            content = result['content']
            score = 1 - result['score']

            # 토큰 추정 (대략 1 토큰 = 4 글자)
            tokens = len(content) // 4
            total_tokens += tokens

            print(f"   {i}. {source} (관련도: {score:.1%}, ~{tokens} 토큰)")

            context_parts.append(f"[출처: {source}]\n{content}")

        context = "\n\n---\n\n".join(context_parts)

        print(f"\n💾 총 컨텍스트: ~{total_tokens} 토큰")
        print(f"   (전체 문서 대비 ~{(total_tokens/25000)*100:.1f}% 사용)\n")

        # 3. Claude에게 질문
        print("🤖 Claude에게 질문 중...\n")

        message = self.client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4000,
            system="""당신은 KMTLS 그룹웨어 프로젝트의 전문가입니다.
제공된 문서를 바탕으로 정확하고 상세하게 답변해주세요.
답변 시 출처 문서를 명시해주세요.""",
            messages=[
                {
                    "role": "user",
                    "content": f"""다음은 프로젝트 문서에서 검색한 관련 내용입니다:

{context}

---

위 문서를 참고하여 다음 질문에 답변해주세요:

{question}

답변 형식:
1. 핵심 답변을 먼저 제시
2. 상세 설명
3. 관련 코드나 예시 (있다면)
4. 참고한 문서 출처"""
                }
            ]
        )

        return message.content[0].text

    def interactive_mode(self):
        """대화형 모드"""
        print("\n" + "="*70)
        print("🤖 Claude + RAG 대화형 모드")
        print("="*70)
        print("질문을 입력하세요. (종료: 'exit', 'quit', 'q')")
        print("="*70 + "\n")

        while True:
            try:
                question = input("\n💬 질문: ").strip()

                if question.lower() in ['exit', 'quit', 'q']:
                    print("\n👋 종료합니다.\n")
                    break

                if not question:
                    continue

                answer = self.query_with_rag(question)

                print("\n" + "="*70)
                print("📝 답변:")
                print("="*70)
                print(answer)
                print("="*70)

            except KeyboardInterrupt:
                print("\n\n👋 종료합니다.\n")
                break
            except Exception as e:
                print(f"\n❌ 오류 발생: {str(e)}\n")


def main():
    """메인 함수"""
    import argparse

    parser = argparse.ArgumentParser(description='Claude + RAG Query System')
    parser.add_argument('--question', '-q', type=str, help='질문')
    parser.add_argument('--interactive', '-i', action='store_true',
                       help='대화형 모드')
    parser.add_argument('--top-k', type=int, default=5,
                       help='검색 결과 개수 (기본: 5)')

    args = parser.parse_args()

    # API 키 확인
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("❌ ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다.")
        print("   .env 파일에 다음을 추가하세요:")
        print("   ANTHROPIC_API_KEY=your_api_key_here")
        sys.exit(1)

    query_system = ClaudeRAGQuery()

    if args.interactive:
        query_system.interactive_mode()
    elif args.question:
        answer = query_system.query_with_rag(args.question, top_k=args.top_k)
        print("\n" + "="*70)
        print("📝 답변:")
        print("="*70)
        print(answer)
        print("="*70 + "\n")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
