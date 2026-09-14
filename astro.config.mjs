// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// 페이지는 기본이 정적(SSG)이다. 작례·홈처럼 SSR이 필요한 페이지만 `export const prerender = false` (결정 #13 #18).
export default defineConfig({
  // 어댑터가 기본으로 켜는 KV 세션을 끈다. 세션은 Better Auth가 Postgres에 둔다 (결정 #28 #19).
  session: false,
  adapter: cloudflare({
    // 기본값(cloudflare-binding)은 Cloudflare Images 변환을 쓴다.
    // 이미지는 브라우저에서 변환하고 서버는 검증만 하므로 쓰지 않는다 (결정 #26).
    imageService: 'passthrough',
  }),
});
