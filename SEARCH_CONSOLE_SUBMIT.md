# Search Console 제출 체크리스트

최종 업데이트: 2026-02-16

## 1) 속성 등록
- Search Console에서 `https://foodpick.today/` URL 접두어 속성을 추가합니다.

## 2) 소유권 확인
- 가장 빠른 방식: `HTML 태그` 또는 `DNS TXT`.
- HTML 태그를 선택하면 제공되는 `google-site-verification` 메타 태그를 `index.html`의 `<head>`에 추가합니다.
- DNS TXT를 선택하면 도메인 DNS 설정에 TXT 레코드를 추가합니다.

## 3) 사이트맵 제출
- Search Console > Sitemaps 메뉴에서 아래 URL 제출:
- `https://foodpick.today/sitemap.xml`

## 4) 색인 요청 우선순위
- URL 검사로 먼저 요청:
- `https://foodpick.today/`
- `https://foodpick.today/meal-trend-guide.html`
- `https://foodpick.today/lunch-decision-guide.html`
- `https://foodpick.today/dinner-budget-guide.html`

## 5) 제출 전 확인
- `https://foodpick.today/ads.txt` 접근 가능
- `https://foodpick.today/robots.txt` 접근 가능
- `https://foodpick.today/sitemap.xml` 접근 가능
- 정책 페이지 접근 가능:
  - `https://foodpick.today/privacy.html`
  - `https://foodpick.today/terms.html`
