// Cloudflare 환경 변수 접근은 이 파일과 platform/ 안에서만 한다 (결정 #19).
import { env } from 'cloudflare:workers';
import { parseSwitches, type Switches } from '../services/switches';

export function readSwitches(): Switches {
  return parseSwitches({
    UPLOADS_ENABLED: env.UPLOADS_ENABLED,
    SIGNUP_ENABLED: env.SIGNUP_ENABLED,
    SEARCH_ENABLED: env.SEARCH_ENABLED,
    READ_ONLY: env.READ_ONLY,
  });
}
