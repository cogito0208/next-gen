#!/bin/bash

##############################################################################
# Claude + RAG 시작 스크립트
#
# 기능:
# 1. Skills 폴더 변경 감지
# 2. 필요시 RAG DB 자동 업데이트
# 3. Claude 대화형 모드 실행
##############################################################################

set -e  # 오류 시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 프로젝트 루트 디렉토리
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# 환경 확인 함수
check_environment() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}🔍 환경 확인 중...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Python 확인
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python3이 설치되어 있지 않습니다.${NC}"
        echo -e "${YELLOW}   설치: brew install python3 (macOS)${NC}"
        exit 1
    fi

    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✅ Python ${PYTHON_VERSION}${NC}"

    # 가상환경 확인 및 생성
    if [ ! -d "rag/venv" ]; then
        echo -e "${YELLOW}📦 가상환경 생성 중...${NC}"
        python3 -m venv rag/venv
        echo -e "${GREEN}✅ 가상환경 생성 완료${NC}"
    fi

    # 가상환경 활성화
    source rag/venv/bin/activate

    # 의존성 확인
    if [ ! -f "rag/.dependencies_installed" ]; then
        echo -e "${YELLOW}📦 의존성 패키지 설치 중... (1-2분 소요)${NC}"
        pip install -q --upgrade pip
        pip install -q -r rag/requirements.txt
        touch rag/.dependencies_installed
        echo -e "${GREEN}✅ 의존성 설치 완료${NC}"
    else
        echo -e "${GREEN}✅ 의존성 패키지 확인됨${NC}"
    fi

    # 환경 변수 확인
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ .env 파일이 없습니다.${NC}"
        echo -e "${YELLOW}   .env.example을 복사하여 .env를 생성하고 API 키를 설정하세요:${NC}"
        echo -e "${YELLOW}   cp .env.example .env${NC}"
        exit 1
    fi

    # API 키 확인
    source .env

    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${RED}❌ ANTHROPIC_API_KEY가 설정되지 않았습니다.${NC}"
        echo -e "${YELLOW}   .env 파일에 다음을 추가하세요:${NC}"
        echo -e "${YELLOW}   ANTHROPIC_API_KEY=your_api_key_here${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ ANTHROPIC_API_KEY 확인됨${NC}"

    echo ""
}

# RAG 업데이트 확인 및 실행
update_rag_if_needed() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}🔄 RAG DB 상태 확인 중...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    python3 rag/rag_system.py

    echo ""
}

# 메인 메뉴
show_menu() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}🤖 Claude + RAG 시스템${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}모드 선택:${NC}"
    echo -e "  ${GREEN}1${NC}) 대화형 모드 (추천)"
    echo -e "  ${GREEN}2${NC}) 단일 질문 모드"
    echo -e "  ${GREEN}3${NC}) RAG 검색만 (Claude 없이)"
    echo -e "  ${GREEN}4${NC}) RAG DB 강제 재생성"
    echo -e "  ${GREEN}5${NC}) 종료"
    echo ""
    echo -e -n "${CYAN}선택 (1-5): ${NC}"
}

# 대화형 모드
interactive_mode() {
    echo ""
    python3 rag/query_rag.py --interactive
}

# 단일 질문 모드
single_question_mode() {
    echo ""
    echo -e -n "${CYAN}💬 질문을 입력하세요: ${NC}"
    read question

    if [ -n "$question" ]; then
        python3 rag/query_rag.py --question "$question"
    fi
}

# RAG 검색만
rag_search_only() {
    echo ""
    echo -e -n "${CYAN}🔍 검색어를 입력하세요: ${NC}"
    read query

    if [ -n "$query" ]; then
        python3 rag/rag_system.py --query "$query"
    fi
}

# RAG DB 강제 재생성
force_rebuild_rag() {
    echo ""
    echo -e "${YELLOW}⚠️  RAG DB를 강제로 재생성합니다...${NC}"
    python3 rag/rag_system.py --force
}

# 메인 실행
main() {
    clear

    # 환경 확인
    check_environment

    # RAG 업데이트 확인
    update_rag_if_needed

    # 메인 루프
    while true; do
        show_menu
        read choice

        case $choice in
            1)
                interactive_mode
                ;;
            2)
                single_question_mode
                ;;
            3)
                rag_search_only
                ;;
            4)
                force_rebuild_rag
                ;;
            5)
                echo ""
                echo -e "${GREEN}👋 종료합니다.${NC}"
                echo ""
                exit 0
                ;;
            *)
                echo ""
                echo -e "${RED}❌ 잘못된 선택입니다. 1-5를 입력하세요.${NC}"
                echo ""
                sleep 2
                ;;
        esac

        echo ""
        echo -e "${YELLOW}계속하려면 Enter를 누르세요...${NC}"
        read
        clear

        # RAG 재확인 (파일이 변경되었을 수 있음)
        update_rag_if_needed
    done
}

# 스크립트 실행
main
