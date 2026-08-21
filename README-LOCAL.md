# 왜 안 팔릴까 — 내 컴퓨터에서 실행하기

## 1. 먼저 설치할 프로그램

- Node.js 22.13 이상: https://nodejs.org/
- Visual Studio Code: https://code.visualstudio.com/

설치가 끝나면 VS Code를 다시 실행합니다.

## 2. 프로젝트 열기

1. 이 ZIP 파일의 압축을 풉니다.
2. VS Code에서 `파일 → 폴더 열기`를 선택합니다.
3. 압축을 푼 `why-not-selling-local-v1` 폴더를 엽니다.
4. VS Code 상단 메뉴에서 `터미널 → 새 터미널`을 선택합니다.

## 3. 최초 한 번만 설치

PowerShell 터미널에서 다음 명령을 실행합니다.

```powershell
npm install
```

## 4. 사이트 실행 — Windows

```powershell
npm run dev:windows
```

브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:3000
```

실행을 멈출 때는 터미널에서 `Ctrl + C`를 누릅니다.

`npx vite`는 실행하지 마세요. 원본의 Vite 설정은 ChatGPT Sites와 Cloudflare 배포 환경용이며 로컬 도구가 Linux를 전제로 합니다. Windows에서는 위의 Next.js 개발 서버를 사용합니다.

## 5. 주로 수정할 파일

- `app/page.tsx`: 메인 화면의 문구와 섹션
- `app/diagnosis-form.tsx`: 입력항목, 진단 계산식, 결과 문구
- `app/globals.css`: 색상, 배치, 모바일 화면
- `app/layout.tsx`: 브라우저 제목과 사이트 설명

파일을 저장하면 실행 중인 브라우저 화면에 변경사항이 자동 반영됩니다.

## 6. 작업 후 ChatGPT Sites에 반영하는 방법

로컬에서 수정한 파일을 이 대화에 다시 첨부하면 기존 `왜 안 팔릴까` 사이트에 반영하고 검증·배포할 수 있습니다.

이 ZIP에는 현재 진단 엔진 소스가 들어 있지만 `node_modules`, 빌드 결과물, 배포 저장소 이력은 포함하지 않았습니다.
