import { describe, expect, it } from 'vitest';
import { blockedBySwitch, parseSwitches } from '../src/services/switches';

const allOn = parseSwitches({ UPLOADS_ENABLED: 'true', SIGNUP_ENABLED: 'true', SEARCH_ENABLED: 'true', READ_ONLY: 'false' });

describe('parseSwitches', () => {
  it('"true"만 켜진 것으로 본다', () => {
    expect(parseSwitches({ UPLOADS_ENABLED: 'TRUE ' }).uploadsEnabled).toBe(true);
    expect(parseSwitches({ UPLOADS_ENABLED: '1' }).uploadsEnabled).toBe(false);
    expect(parseSwitches({ UPLOADS_ENABLED: 'ture' }).uploadsEnabled).toBe(false);
  });

  it('값이 없으면 기능은 꺼지고 읽기 전용도 꺼진다', () => {
    expect(parseSwitches({})).toEqual({ uploadsEnabled: false, signupEnabled: false, searchEnabled: false, readOnly: false });
  });
});

describe('blockedBySwitch', () => {
  it('READ_ONLY는 쓰기 메서드만 막는다', () => {
    const sw = { ...allOn, readOnly: true };
    expect(blockedBySwitch('POST', '/api/posts', sw)).toEqual({ status: 503, reason: 'read_only' });
    expect(blockedBySwitch('delete', '/api/posts/1', sw)?.reason).toBe('read_only');
    expect(blockedBySwitch('GET', '/api/posts', sw)).toBeNull();
  });

  it('꺼진 기능의 경로는 메서드와 무관하게 막는다', () => {
    const sw = { ...allOn, uploadsEnabled: false, searchEnabled: false };
    expect(blockedBySwitch('POST', '/api/uploads', sw)?.reason).toBe('uploads_disabled');
    expect(blockedBySwitch('PUT', '/api/uploads/abc', sw)?.reason).toBe('uploads_disabled');
    expect(blockedBySwitch('GET', '/api/search', sw)?.reason).toBe('search_disabled');
  });

  it('접두어가 겹치는 다른 경로는 막지 않는다', () => {
    const sw = { ...allOn, uploadsEnabled: false };
    expect(blockedBySwitch('POST', '/api/uploadsx', sw)).toBeNull();
  });

  it('모두 켜져 있으면 통과', () => {
    expect(blockedBySwitch('POST', '/api/uploads', allOn)).toBeNull();
  });
});
