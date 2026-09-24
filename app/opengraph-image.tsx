import { ImageResponse } from 'next/og';

export const alt = 'jev-explained: a model that returns decisions, not text';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const STATS = [
  { value: '5-6x', label: 'faster than Claude' },
  { value: '26-64x', label: 'cheaper' },
  { value: '3', label: 'answer types' },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0c0c0d',
          color: '#f2f2f0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#a8a8a2' }}>jev-explained</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            A model that returns&nbsp;<span style={{ color: '#7c93ff' }}>decisions</span>, not text.
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#a8a8a2' }}>
            How TypeSafe AI&apos;s Jev works, what it costs, and what independent tests found.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '18px 26px',
                border: '1px solid #2a2a2e',
                borderRadius: 16,
                background: '#161618',
              }}
            >
              <span style={{ fontSize: 40, fontWeight: 700, color: '#7c93ff' }}>{s.value}</span>
              <span style={{ fontSize: 22, color: '#a8a8a2' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
