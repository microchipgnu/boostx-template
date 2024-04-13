/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const boostxData = require('./boostx.json');

const nextConfig = {
    env: {
        NETWORK: boostxData.NETWORK,
        PRIVATE_KEY: boostxData.PRIVATE_KEY,
        PROJECT_NAME: boostxData.PROJECT_NAME,
        PROJECT_DESCRIPTION: boostxData.PROJECT_DESCRIPTION,
        SYMBOL: boostxData.SYMBOL,
        CONTRACT_ADDRESS: boostxData.CONTRACT_ADDRESS,
        EPOCH_CRONJOB: boostxData.EPOCH_CRONJOB,
        USER_EARNINGS_SCHEMA: boostxData.USER_EARNINGS_SCHEMA,
        BOOST_FULL_SCHEMA_ID: boostxData.BOOST_FULL_SCHEMA_ID,
        EPOCH_STATE_FULL_SCHEMA_ID: boostxData.EPOCH_STATE_FULL_SCHEMA_ID,
        AIRSTACK_API_KEY: boostxData.AIRSTACK_API_KEY,
        LIGHTHOUSE_STORAGE_API_KEY: boostxData.LIGHTHOUSE_STORAGE_API_KEY
      },
}

export default nextConfig
