#!/bin/bash
##############################################################################
# KMTLS 그룹웨어 개발 서버 시작 스크립트
##############################################################################

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   KMTLS 그룹웨어 개발 서버 시작       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# 포트 확인
check_port() {
  lsof -ti:$1 > /dev/null 2>&1
}

# Backend 시작
start_backend() {
  echo -e "${YELLOW}→ Backend 시작 (포트 3002)...${NC}"
  if check_port 3002; then
    echo -e "${GREEN}  ✓ Backend 이미 실행 중 (http://localhost:3002)${NC}"
    return
  fi
  cd "$ROOT_DIR/backend"
  npm run start:dev > /tmp/kmtls_backend.log 2>&1 &
  echo $! > /tmp/kmtls_backend.pid
  echo -e "${GREEN}  ✓ Backend 시작됨 PID=$(cat /tmp/kmtls_backend.pid)${NC}"
}

# Frontend 시작
start_frontend() {
  echo -e "${YELLOW}→ Frontend 시작 (포트 3001)...${NC}"
  if check_port 3001; then
    echo -e "${GREEN}  ✓ Frontend 이미 실행 중 (http://localhost:3001)${NC}"
    return
  fi
  cd "$ROOT_DIR/web"
  npm run dev > /tmp/kmtls_frontend.log 2>&1 &
  echo $! > /tmp/kmtls_frontend.pid
  echo -e "${GREEN}  ✓ Frontend 시작됨 PID=$(cat /tmp/kmtls_frontend.pid)${NC}"
}

# 중지
stop_all() {
  echo -e "${YELLOW}→ 서비스 중지 중...${NC}"
  [ -f /tmp/kmtls_backend.pid ] && kill $(cat /tmp/kmtls_backend.pid) 2>/dev/null && rm /tmp/kmtls_backend.pid
  [ -f /tmp/kmtls_frontend.pid ] && kill $(cat /tmp/kmtls_frontend.pid) 2>/dev/null && rm /tmp/kmtls_frontend.pid
  echo -e "${GREEN}  ✓ 완료${NC}"
}

case "${1:-start}" in
  start)
    start_backend
    sleep 2
    start_frontend
    echo ""
    echo -e "${CYAN}══════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ 서비스 시작 완료${NC}"
    echo ""
    echo -e "  Frontend:  ${CYAN}http://localhost:3001${NC}"
    echo -e "  Backend:   ${CYAN}http://localhost:3002/api/v1${NC}"
    echo -e "  Swagger:   ${CYAN}http://localhost:3002/api/docs${NC}"
    echo ""
    echo -e "  테스트 계정:"
    echo -e "    CEO:    ceo@kmtls.com / Test1234!"
    echo -e "    PM:     pm1@kmtls.com / Test1234!"
    echo -e "    HR:     hr@kmtls.com  / Test1234!"
    echo -e "${CYAN}══════════════════════════════════════${NC}"
    echo ""
    ;;
  stop)
    stop_all
    ;;
  logs)
    case "$2" in
      backend)  tail -f /tmp/kmtls_backend.log ;;
      frontend) tail -f /tmp/kmtls_frontend.log ;;
      *)        echo "Usage: $0 logs [backend|frontend]" ;;
    esac
    ;;
  *)
    echo "Usage: $0 [start|stop|logs <backend|frontend>]"
    ;;
esac
