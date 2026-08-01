@AGENTS.md

# My Korean Name - Project Guide

## Overview
외국인이 영어 이름을 입력하면 한글 음역 + 캘리그라피 애니메이션 + 한국 문화 기반 성격 분석을 제공하는 글로벌 바이럴 웹서비스.

- Target: K-pop 팬, 한국 여행자, 한국 문화에 관심 있는 외국인
- 수익 모델 (추후): 프리미엄 스타일, 디지털 다운로드, POD 굿즈
- 운영 비용: 제로 (100% 클라이언트사이드 + Vercel 무료 티어)
- 도메인: mykoreanname.com (예정)

## Tech Stack
- Next.js 16.2.12 (App Router, TypeScript, Tailwind v4)
- Vercel 배포 예정 (무료 티어)
- 외부 API 없음, 서버리스 함수 없음, DB 없음

## Project Structure
```
src/
  app/
    page.tsx                 # 랜딩 페이지 (Hero + NameInput + Popular names + SEO FAQ)
    layout.tsx               # Google Fonts (Hahmlet, Gowun Batang, Jua, Nanum Pen Script)
    globals.css              # Tailwind
    sitemap.ts               # 인기 이름 30개 사전 인덱싱
    robots.ts
    result/[name]/
      page.tsx               # 결과 페이지 (SSR, generateMetadata)
      opengraph-image.tsx    # Dynamic OG image (1200x630 PNG)
  components/
    NameInput.tsx            # 영어 전용 입력 (regex 필터), /result/[name] 라우팅
    ResultCard.tsx           # 결과 카드 (캘리그라피, 듣기, 성격분석, 이미지저장)
    CalligraphyAnimation.tsx # Canvas 기반 좌→우 클리핑 애니메이션, 4종 폰트
    ShareButtons.tsx         # X, Reddit, Copy Link, Native Share
  lib/
    transliterate.ts         # 3-tier 음역: Override(200+) → CMU(134K) → Pattern fallback
    arpabet-to-hangul.ts     # ARPAbet → 한글 2-pass 변환 (토큰화 → 종성 병합)
    personality.ts           # 초성 종합 분석 기반 성격 생성 (결정론적)
```

## Core Logic

### 음역 (transliterate.ts)
1. 수동 오버라이드: 200+ 이름 (관용 표기가 CMU와 다른 경우)
2. CMU Pronouncing Dictionary: 134,000+ 단어 ARPAbet 발음 → 한글
3. 패턴 기반 fallback: CMU에도 없는 이름
- 하이픈 이름: 파트별 분리 변환 (Mary-Jane → 메리-제인)
- 아포스트로피: 통합 후 오버라이드 우선 체크 (O'Brien → 오브라이언)
- 오버라이드 추가 시 중복 키 주의 (TypeScript strict mode에서 빌드 에러)

### 성격 분석 (personality.ts)
- 한글 이름의 초성(ㄱ~ㅎ) 19개별 프로필 정의 (키워드, 동물/오행/관직 매핑)
- 모든 초성을 종합 분석 (가중 합산 + 이름 길이 변이)
- ㅇ 초성은 의미 있는 다른 초성으로 대체
- 동물상 8종 균등 분포 (8~20%)
- 같은 이름 = 항상 같은 결과 (결정론적 해시)

### ARPAbet 변환 (arpabet-to-hangul.ts)
- Pass 1: 음소 → 한글 토큰 (초성+모음 합성, 반모음 처리, 이중모음 tail 분리)
- Pass 2: 받침 병합 (보수적: M→ㅁ, N→ㄴ, NG→ㅇ, L→ㄹ만)
- 한글 유니코드 합성: 0xAC00 + 초성*21*28 + 중성*28 + 종성

## Features Completed (Dev Sprint 1~2)
- [x] 영어→한글 음역 (200+ override + CMU 134K + pattern fallback)
- [x] 하이픈/아포스트로피 이름 처리
- [x] 풀네임 (이름+성) 지원
- [x] 캘리그라피 애니메이션 (Canvas, 4종 폰트, replay)
- [x] 초성 종합 분석 기반 성격 (동물상, 오행, 관직, 행운음식, 행운번호, 궁합)
- [x] 이름 소리 분석 키워드 태그 + 설명문
- [x] 듣기 버튼 (Web Speech API, ko-KR)
- [x] 이미지 저장 (html2canvas-pro)
- [x] 공유 (X, Reddit, Copy Link, Native Share)
- [x] Dynamic OG image (이름별)
- [x] SEO (sitemap, robots, per-page metadata, keywords)
- [x] 반응형 UI (모바일 퍼스트)
- [x] 빌드 성공 + 28/28 regression 테스트 통과

## TODO: Sprint 3 - Infrastructure
- [ ] Git 초기화 + 첫 커밋
- [ ] Vercel 프로젝트 생성 및 배포
- [ ] 도메인 연결 (mykoreanname.com)
- [ ] HTTPS 확인
- [ ] Vercel Analytics 또는 Google Analytics 연동
- [ ] 에러 모니터링 (Vercel 기본 or Sentry 무료)

## TODO: Sprint 4 - SEO & Marketing
- [ ] Google Search Console 등록 + sitemap 제출
- [ ] Bing Webmaster 등록
- [ ] OG 이미지 실제 도메인 URL 테스트
- [ ] metadataBase URL을 실제 도메인으로 변경 (layout.tsx)
- [ ] Reddit 런칭 (r/korea, r/korean, r/kpop, r/LearnKorean, r/hangul)
- [ ] X/Twitter 런칭 포스트
- [ ] Product Hunt 등록 고려
- [ ] 인기 이름별 개별 페이지 SEO 강화 (블로그 스타일 콘텐츠)

## TODO: Backlog (P2+)
- [ ] 결과 섹션 스크롤 트리거 애니메이션 (순차 공개)
- [ ] 랜딩 페이지 실시간 데모 (이름 자동 전환)
- [ ] 궁합 테스트 (/compatibility/name1/name2)
- [ ] 인스타 스토리 비율 이미지 저장 (1080x1920)
- [ ] 한국 세대별 이름 콘텐츠
- [ ] 다국어 입력 지원 (일본어, 중국어 이름)
- [ ] 프리미엄 캘리그라피 스타일 (수익화)

## Dev Notes
- `npm run dev` (port 3000)
- `npm run build`로 빌드 체크 (TypeScript strict, 중복 키 에러 주의)
- 오버라이드 추가 시 기존 키와 중복 안 되는지 확인 필수
- CalligraphyAnimation은 `maxFontSize` prop (fontSize 아님)
- Google Fonts: Hahmlet(serif), Gowun Batang(serif), Jua(sans, K-pop), Nanum Pen Script(cursive)
