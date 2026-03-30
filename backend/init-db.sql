-- ============================================================
-- KMTLS 그룹웨어 데이터베이스 초기화 스크립트
-- ============================================================

-- 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS user_mgmt;
CREATE SCHEMA IF NOT EXISTS organization;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS project;
CREATE SCHEMA IF NOT EXISTS hr;

-- 권한 설정
GRANT ALL ON SCHEMA auth TO postgres;
GRANT ALL ON SCHEMA user_mgmt TO postgres;
GRANT ALL ON SCHEMA organization TO postgres;
GRANT ALL ON SCHEMA crm TO postgres;
GRANT ALL ON SCHEMA project TO postgres;
GRANT ALL ON SCHEMA hr TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA user_mgmt TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA organization TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA crm TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA project TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA hr TO postgres;

-- ============================================================
-- 완료 메시지
-- ============================================================
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'KMTLS DB 초기화 완료';
    RAISE NOTICE '스키마: auth, user_mgmt, organization, crm, project, hr';
    RAISE NOTICE 'Extensions: uuid-ossp, pgcrypto';
    RAISE NOTICE '============================================';
END $$;
