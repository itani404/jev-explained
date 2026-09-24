import { config } from 'dotenv';
import { describeGatewayError } from '../lib/gateway-errors';

// Same precedence as Next.js: .env.local wins over .env.
config({ path: ['.env.local', '.env'], quiet: true });

export function run(main: () => Promise<void>) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    console.error('✖ Missing AI_GATEWAY_API_KEY. Copy .env.example to .env.local and add your key.');
    process.exit(1);
  }

  main().catch((err: unknown) => {
    const known = describeGatewayError(err);
    const message = known?.message ?? (err instanceof Error ? err.message : String(err));
    console.error(`✖ ${message}`);
    if (!known && process.env.DEBUG) console.error(err);
    process.exit(1);
  });
}
