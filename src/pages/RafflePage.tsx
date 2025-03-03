import { LoadingButton } from "@mui/lab";
import { Button, Card, CardContent, Stack, Typography, Box, Chip, Grid, Fade, Zoom } from "@mui/material";
import { useCurrentAddress } from "@roochnetwork/rooch-sdk-kit";
import { useState, useEffect } from "react";
import { CheckIn } from '../componnents/check_in';
import { Raffle } from '../componnents/raffle';
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

// Define background animation
const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Animated background container
const AnimatedBackground = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/original_bg.webp');
  background-size: cover;
  background-position: center;
  z-index: -1;
  animation: ${backgroundAnimation} 30s ease infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
  }
`;

// Custom card style
const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }
`;

// Custom button style
const StyledButton = styled(LoadingButton)`
  border-radius: 50px;
  padding: 12px 32px;
  font-weight: bold;
  text-transform: none;
  font-size: 1rem;
  transition: transform 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
`;

function RafflePage() {
  const currentAddress = useCurrentAddress();
  const [loading, setLoading] = useState(false);
  const [checkInRecord, setCheckInRecord] = useState<any>(null);
  const [raffleConfig, setRaffleConfig] = useState<any>(null);
  const [raffleRecord, setRaffleRecord] = useState<any>(null);
  const [justRaffled, setJustRaffled] = useState(false);
  const { width, height } = useWindowSize();

  const { GetWeekRaffle, QueryCheckInRecord } = CheckIn();
  const { 
    GetCheckInRaffleByFate, 
    ClaimMaxRaffle, 
    QueryCheckInRaffle, 
    QueryCheckInRaffleRecord 
  } = Raffle();

  useEffect(() => {
    if (currentAddress) {
      fetchData();
    }
  }, [currentAddress]);

  const fetchData = async () => {
    if (!currentAddress) {
      console.log('等待地址加载...');
      return;
    }

    try {
      const checkInRecordData = await QueryCheckInRecord();
      const raffleConfigData = await QueryCheckInRaffle();
      const raffleRecordData = await QueryCheckInRaffleRecord();
      
      setCheckInRecord(checkInRecordData);
      setRaffleConfig(raffleConfigData);
      setRaffleRecord(raffleRecordData);
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  const handleWeekRaffle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await GetWeekRaffle();
      await fetchData();
      setJustRaffled(true);
      setTimeout(() => setJustRaffled(false), 3000); // Reset confetti after 3s
    } catch (error) {
      console.error('每周抽奖失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFateRaffle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await GetCheckInRaffleByFate();
      await fetchData();
      setJustRaffled(true);
      setTimeout(() => setJustRaffled(false), 3000);
    } catch (error) {
      console.error('Fate抽奖失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimMaxRaffle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await ClaimMaxRaffle();
      await fetchData();
      setJustRaffled(true);
      setTimeout(() => setJustRaffled(false), 3000);
    } catch (error) {
      console.error('领取保底失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      
      {justRaffled && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
          onConfettiComplete={() => setJustRaffled(false)}
        />
      )}
      
      <Stack
        className="font-sans min-w-[1024px]"
        direction="column"
        sx={{
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-8">
          <Button 
            variant="outlined" 
            onClick={() => window.history.back()}
            startIcon={<span>←</span>}
          >
            返回首页
          </Button>
          <Typography variant="h4" className="font-bold">
            抽奖活动
          </Typography>
          <Box width={100} />
        </Stack>

        <Grid container spacing={4}>
          {/* Raffle Status Card */}
          <Grid item xs={12} md={6}>
            <StyledCard elevation={3} className="mb-8">
              <CardContent>
                <Typography variant="h5" className="mb-4 font-bold" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>🎲</Box>
                  抽奖状态
                </Typography>
                
                {checkInRecord && raffleRecord ? (
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>剩余抽奖次数:</Typography>
                      <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                        <Chip 
                          label={checkInRecord?.lottery_count || 0} 
                          color="secondary" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Zoom>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>已抽取次数:</Typography>
                      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                        <Chip 
                          label={raffleRecord?.raffle_count || 0} 
                          color="primary" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Zoom>
                    </Box>
                  </Stack>
                ) : (
                  <Typography>加载抽奖记录中...</Typography>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Raffle Pool Card */}
          <Grid item xs={12} md={6}>
            <StyledCard elevation={3} className="mb-8">
              <CardContent>
                <Typography variant="h5" className="mb-4 font-bold" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>🏆</Box>
                  奖池信息
                </Typography>
                
                {raffleConfig ? (
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>特等奖概率:</Typography>
                      <Chip 
                        label={`${raffleConfig.grand_prize_weight}%`} 
                        color="primary" 
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>二等奖概率:</Typography>
                      <Chip 
                        label={`${raffleConfig.second_prize_weight}%`} 
                        color="success" 
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>三等奖概率:</Typography>
                      <Chip 
                        label={`${raffleConfig.third_prize_weight}%`} 
                        color="secondary" 
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Stack>
                ) : (
                  <Typography>加载奖池信息中...</Typography>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={3} justifyContent="center" className="mt-4">
          <StyledButton
            variant="contained"
            color="primary"
            size="large"
            loading={loading}
            onClick={handleWeekRaffle}
            disabled={parseInt(checkInRecord?.lottery_count || '0') === 0}
            startIcon={<span>🎲</span>}
          >
            每周抽奖 ({checkInRecord?.lottery_count || 0})
          </StyledButton>
          
          <StyledButton
            variant="contained"
            color="secondary"
            size="large"
            loading={loading}
            onClick={handleFateRaffle}
            startIcon={<span>✨</span>}
          >
            Fate抽奖
          </StyledButton>
          
          <StyledButton
            variant="outlined"
            color="success"
            size="large"
            loading={loading}
            onClick={handleClaimMaxRaffle}
            disabled={parseInt(raffleRecord?.raffle_count || '0') < 10}
            startIcon={<span>🏅</span>}
          >
            领取保底奖励
          </StyledButton>
        </Stack>

        {parseInt(raffleRecord?.raffle_count || '0') < 10 && (
          <Fade in={true}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              再抽 {10 - parseInt(raffleRecord?.raffle_count || '0')} 次即可领取保底奖励！
            </Typography>
          </Fade>
        )}
      </Stack>
    </>
  );
}

export default RafflePage;