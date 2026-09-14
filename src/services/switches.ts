// 차단 스위치 해석 (결정 #20). 플랫폼을 모르는 순수 함수라 테스트에서 바로 부른다.

export type Switches = {
  uploadsEnabled: boolean;
  signupEnabled: boolean;
  searchEnabled: boolean;
  readOnly: boolean;
};

export type RawSwitches = Partial<Record<'UPLOADS_ENABLED' | 'SIGNUP_ENABLED' | 'SEARCH_ENABLED' | 'READ_ONLY', string>>;

// "true"만 참이다. 값이 없거나 오타면 거짓 — 비용이 드는 기능은 설정 실수 시 꺼진 쪽으로 떨어진다.
const on = (v: string | undefined) => v?.trim().toLowerCase() === 'true';

export function parseSwitches(raw: RawSwitches): Switches {
  return {
    uploadsEnabled: on(raw.UPLOADS_ENABLED),
    signupEnabled: on(raw.SIGNUP_ENABLED),
    searchEnabled: on(raw.SEARCH_ENABLED),
    readOnly: on(raw.READ_ONLY),
  };
}

export type Blocked = { status: 503; reason: string };

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// 경로 앞부분 → 그 경로를 끄는 스위치. 기능이 생길 때 여기에 추가한다.
const ROUTE_SWITCHES: Array<[prefix: string, key: keyof Switches, reason: string]> = [
  ['/api/uploads', 'uploadsEnabled', 'uploads_disabled'],
  ['/api/auth/sign-up', 'signupEnabled', 'signup_disabled'],
  ['/api/search', 'searchEnabled', 'search_disabled'],
];

/** 요청이 스위치에 막히면 사유를, 통과면 null을 돌려준다. */
export function blockedBySwitch(method: string, pathname: string, sw: Switches): Blocked | null {
  if (sw.readOnly && WRITE_METHODS.has(method.toUpperCase())) {
    return { status: 503, reason: 'read_only' };
  }
  for (const [prefix, key, reason] of ROUTE_SWITCHES) {
    if ((pathname === prefix || pathname.startsWith(prefix + '/')) && !sw[key]) {
      return { status: 503, reason };
    }
  }
  return null;
}
