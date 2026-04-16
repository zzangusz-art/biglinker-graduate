// Vercel Serverless Function — Slack 알림 중계
// 환경 변수 SLACK_WEBHOOK 에 Slack Incoming Webhook URL 등록 필요
module.exports = async function handler(req, res) {
  // CORS 허용 (동일 Vercel 프로젝트 내 호출)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.SLACK_WEBHOOK;
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK 환경 변수가 설정되지 않았습니다.');
    // 클라이언트에는 성공처럼 응답 (UX 방해 방지)
    return res.status(200).json({ ok: true });
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Slack webhook 전송 실패:', err);
    return res.status(200).json({ ok: true }); // 클라이언트 UX 방해 방지
  }
};
