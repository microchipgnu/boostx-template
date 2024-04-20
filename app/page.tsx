import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import { CSSProperties } from 'react'


export async function generateMetadata(): Promise<Metadata> {

  const url = process.env.VERCEL_URL
  const frameTags = await getFrameMetadata(
    url ? `https://${url}/api` : 'http://localhost:3000/api',
  )
  return {
    other: frameTags,
  }
}

export default function Home() {

  const symbol = process.env.SYMBOL
  const network = process.env.NETWORK
  const address = process.env.ADDRESS
  const projectName = process.env.PROJECT_NAME
  const projectDescription = process.env.PROJECT_DESCRIPTION
  const contractAddress = process.env.CONTRACT_ADDRESS
  const epochCronjob = process.env.EPOCH_CRONJOB
  const userEarningsSchema = process.env.USER_EARNINGS_SCHEMA
  const boostFullSchemaId = process.env.BOOST_FULL_SCHEMA_ID
  const epochStateFullSchemaId = process.env.EPOCH_STATE_FULL_SCHEMA_ID

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 'auto', // Changed from 100vh to auto for content fitting
    fontFamily: 'Arial, sans-serif',
    padding: '40px 20px', // Padding increased for better spacing
    margin: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
  };

  const sectionStyle: CSSProperties = {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '10px 0',
    width: '80%',
    textAlign: 'left'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    color: '#f4f4f9',
    margin: '10px 0'
  };

  const infoStyle = {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '5px'
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Welcome to the ${symbol} Community!</div>
      <div style={sectionStyle}>
        <p style={infoStyle}>Network: {network}</p>
        <p style={infoStyle}>Address: {address}</p>
        <p style={infoStyle}>Project Name: {projectName}</p>
        <p style={infoStyle}>Project Description: {projectDescription}</p>
        <p style={infoStyle}>Token Symbol: ${symbol}</p>
        <p style={infoStyle}>Contract Address: {contractAddress}</p>
        <p style={infoStyle}>Epoch Cron Job: {epochCronjob}</p>
        <p style={infoStyle}>User Earnings Schema: <a style={infoStyle} href={`https://testnet-scan.sign.global/schema/${userEarningsSchema}`}> {userEarningsSchema}</a></p>
        <p style={infoStyle}>Boost Full Schema ID: <a style={infoStyle} href={`https://scan.sign.global/schema/${boostFullSchemaId}`}> {boostFullSchemaId}</a></p>
        <p style={infoStyle}>Epoch State Full Schema ID: <a style={infoStyle} href={`https://scan.sign.global/schema/${epochStateFullSchemaId}`}> {epochStateFullSchemaId}</a></p>
      </div>
      <a href="/feed" style={{
        marginTop: '20px',
        padding: '10px 15px',
        backgroundColor: '#0070f3',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s'
      }}>Check Boosted Feed</a>
      <a href="/api/dev" style={{
        marginTop: '20px',
        padding: '10px 15px',
        backgroundColor: '#0070f3',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s'
      }}>Dev</a>
    </div>
  );
}