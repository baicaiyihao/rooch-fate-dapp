import { useState, useEffect } from "react";
import { useCurrentAddress } from "@roochnetwork/rooch-sdk-kit";
import { Box, Button, Card, CardContent, Chip, Divider, Fade, Grid, Stack, Typography, Zoom } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { Raffle } from "../componnents/raffle";

// 定义背景动画
const backgroundAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// 创建带有动画背景的容器
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

// 添加浮动粒子动画
const particleFloat = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
`;

// 创建粒子组件
const Particle = styled('div')<{ size: number; top: string; left: string; delay: number }>`
  position: fixed;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: rgba(138, 43, 226, 0.2);
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  z-index: -1;
  animation: ${particleFloat} ${props => 5 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

// 样式化卡片
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
  },
}));

// 样式化按钮
const StyledButton = styled(LoadingButton)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 'bold',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

// 成功消息容器
const SuccessMessage = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  backgroundColor: 'white',
  padding: '32px',
  borderRadius: '16px',
  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '300px',
}));

// 闪烁效果的Chip
const shineAnimation = keyframes`
  0% {
    background-position: -100px;
  }
  100% {
    background-position: 200px;
  }
`;

const ShiningChip = styled(Chip)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
    animation: `${shineAnimation} 2s infinite linear`,
  },
}));

function RafflePage() {
  const currentAddress = useCurrentAddress();
  const [loading, setLoading] = useState(false);
  const [raffleInfo, setRaffleInfo] = useState<any>(null);
  const [raffleRecord, setRaffleRecord] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const {
    GetCheckInRaffleByFate,
    ClaimMaxRaffle,
    QueryCheckInRaffle,
    QueryCheckInRaffleRecord,
  } = Raffle();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raffleInfo = await QueryCheckInRaffle();
        setRaffleInfo(raffleInfo);
        
        const record = await QueryCheckInRaffleRecord();
        setRaffleRecord(record);
      } catch (error) {
        console.error("获取抽奖数据失败:", error);
      }
    };

    if (currentAddress) {
      fetchData();
    }
  }, [currentAddress]);

  // 处理抽奖
  const onGetRaffleByFate = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await GetCheckInRaffleByFate();
      console.log('抽奖结果:', result);
      
      // 重新获取抽奖记录
      const record = await QueryCheckInRaffleRecord();
      setRaffleRecord(record);
      
      // 显示成功提示和彩花效果
      setSuccessMessage('抽奖成功！');
      setShowSuccess(true);
      setShowConfetti(true);
      
      // 3秒后自动关闭成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("抽奖失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理领取最大奖励
  const onClaimMaxRaffle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await ClaimMaxRaffle();
      console.log('领取最大奖励结果:', result);
      
      // 重新获取抽奖记录
      const record = await QueryCheckInRaffleRecord();
      setRaffleRecord(record);
      
      // 显示成功提示和彩花效果
      setSuccessMessage('领取奖励成功！');
      setShowSuccess(true);
      setShowConfetti(true);
      
      // 3秒后自动关闭成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("领取奖励失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      
      {/* 添加浮动粒子 */}
      <Particle size={15} top="10%" left="10%" delay={0} />
      <Particle size={20} top="20%" left="80%" delay={1} />
      <Particle size={12} top="70%" left="15%" delay={2} />
      <Particle size={18} top="40%" left="60%" delay={1.5} />
      <Particle size={10} top="80%" left="75%" delay={0.5} />
      
      {/* 抽奖成功时显示彩花效果 */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      
      {/* 成功提示 */}
      {showSuccess && (
        <SuccessMessage>
          <Box sx={{ mb: 2 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h1" component="div" sx={{ fontSize: '4rem', color: '#4CAF50' }}>
                ✓
              </Typography>
            </motion.div>
          </Box>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            {successMessage}
          </Typography>
          {raffleRecord && (
            <Typography variant="body1" color="text.secondary">
              当前抽奖次数: {raffleRecord.raffle_count}
            </Typography>
          )}
        </SuccessMessage>
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
            抽奖系统
          </Typography>
          <Box width={100} /> {/* 占位元素，保持标题居中 */}
        </Stack>

        <Grid container spacing={4}>
          {/* 抽奖信息卡片 */}
          <Grid item xs={12} md={6}>
            <StyledCard elevation={3} className="mb-8">
              <CardContent>
                <Typography variant="h5" className="mb-4 font-bold" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>📊</Box>
                  我的抽奖记录
                </Typography>
                
                {raffleRecord ? (
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography>当前抽奖次数:</Typography>
                      <Fade in={true} style={{ transitionDelay: '100ms' }}>
                        <ShiningChip 
                          label={raffleRecord.raffle_count} 
                          color="primary" 
                          sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                        />
                      </Fade>
                    </Box>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">加载中...</Typography>
                )}
              </CardContent>
            </StyledCard>
            
            {/* 操作按钮 */}
            <Stack direction="row" spacing={2} justifyContent="center" className="mt-4">
              <StyledButton 
                variant="contained" 
                color="primary"
                loading={loading}
                onClick={onGetRaffleByFate}
                startIcon={<span>🎲</span>}
              >
                使用FATE抽奖
              </StyledButton>
              <StyledButton 
                variant="contained" 
                color="success"
                loading={loading}
                onClick={onClaimMaxRaffle}
                startIcon={<span>🏆</span>}
              >
                领取最大奖励
              </StyledButton>
            </Stack>
          </Grid>
        </Grid>
        
        {/* 抽奖说明 */}
        <StyledCard elevation={2} className="mt-8">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>📝</Box>
              抽奖说明
            </Typography>
            <Typography paragraph>
              1. 您可以使用FATE代币参与抽奖，每次抽奖将消耗一定数量的FATE。
            </Typography>
            <Typography paragraph>
              2. 抽奖有三个奖励等级：大奖、二等奖和三等奖，每个奖项有不同的中奖概率和奖励。
            </Typography>
            <Typography paragraph>
              3. 您可以随时领取最大奖励，系统将根据您的抽奖次数和权重计算最佳奖励。
            </Typography>
            <Typography paragraph>
              4. 抽奖次数会累积，您可以选择积累更多次数以提高获得更高奖励的机会。
            </Typography>
          </CardContent>
        </StyledCard>
      </Stack>
    </>
  );
}

export default RafflePage;