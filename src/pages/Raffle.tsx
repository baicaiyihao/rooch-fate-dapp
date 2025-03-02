import { useState, useEffect } from "react";
import { useCurrentAddress } from "@roochnetwork/rooch-sdk-kit";
import { Box, Button, Card, CardContent, Chip, Divider, Fade, Grid, Stack, Typography, Zoom } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { styled } from "@mui/material/styles";
import { Raffle } from "../componnents/raffle";
import {backgroundAnimation,AnimatedBackground,particleFloat,Particle,shineAnimation} from "../components/shared/animation_components";

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
    const [isDataLoading, setIsDataLoading] = useState(true); // 添加数据加载状态
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // 添加错误信息状态
    const { width, height } = useWindowSize();
  
    const {
      GetCheckInRaffleByFate,
      ClaimMaxRaffle,
      QueryCheckInRaffle,
      QueryCheckInRaffleRecord,
    } = Raffle();
  
    useEffect(() => {
      const fetchData = async () => {
        if (!currentAddress) return;
        
        setIsDataLoading(true);
        setErrorMessage(null);
        try {
          // 使用 Promise.all 并行请求数据提高性能
          const [raffleInfo, record] = await Promise.all([
            QueryCheckInRaffle(),
            QueryCheckInRaffleRecord()
          ]);
          
          setRaffleInfo(raffleInfo);
          setRaffleRecord(record);
        } catch (error) {
          console.error("获取抽奖数据失败:", error);
          setErrorMessage("获取抽奖数据失败，请稍后再试");
        } finally {
          setIsDataLoading(false);
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
      setErrorMessage(null);
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
        setErrorMessage("抽奖失败，请确保您有足够的FATE代币");
      } finally {
        setLoading(false);
      }
    };
  
    // 处理领取最大奖励
    const onClaimMaxRaffle = async () => {
      if (loading) return;
      
      setLoading(true);
      setErrorMessage(null);
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
        setErrorMessage("领取奖励失败，请稍后再试");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <AnimatedBackground />
        
        {/* 添加浮动粒子 - 减少数量以提高性能 */}
        <Particle size={15} top="10%" left="10%" delay={0} />
        <Particle size={20} top="20%" left="80%" delay={1} />
        <Particle size={12} top="70%" left="15%" delay={2} />
        
        {/* 抽奖成功时显示彩花效果 */}
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={300} // 减少粒子数量以提高性能
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
            width: "100%", // 添加固定宽度
            height: "auto", // 添加高度
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
  
          {/* 错误提示 */}
          {errorMessage && (
            <Box 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: '#FFEBEE', 
                borderRadius: 2,
                border: '1px solid #FFCDD2'
              }}
            >
              <Typography color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ mr: 1, fontSize: '1.2rem' }}>⚠️</Box>
                {errorMessage}
              </Typography>
            </Box>
          )}
  
          <Grid container spacing={4}>
            {/* 抽奖信息卡片 */}
            <Grid item xs={12} md={6}>
              <StyledCard elevation={3} className="mb-8">
                <CardContent>
                  <Typography variant="h5" className="mb-4 font-bold" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>📊</Box>
                    我的抽奖记录
                  </Typography>
                  
                  {isDataLoading ? (
                    // 添加骨架屏提高用户体验
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>当前抽奖次数:</Typography>
                        <Box width={80} height={32}>
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              backgroundColor: '#f0f0f0',
                              borderRadius: '16px'
                            }}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  ) : raffleRecord ? (
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
                    <Typography color="text.secondary">暂无抽奖记录</Typography>
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
                  disabled={isDataLoading} // 数据加载时禁用按钮
                >
                  使用FATE抽奖
                </StyledButton>
                <StyledButton 
                  variant="contained" 
                  color="success"
                  loading={loading}
                  onClick={onClaimMaxRaffle}
                  startIcon={<span>🏆</span>}
                  disabled={isDataLoading || (raffleRecord && raffleRecord.raffle_count <= 0)} // 无抽奖次数时禁用
                >
                  领取最大奖励
                </StyledButton>
              </Stack>
            </Grid>
            
            {/* 添加抽奖配置信息卡片 */}
            <Grid item xs={12} md={6}>
              <StyledCard elevation={3} className="mb-8">
                <CardContent>
                  <Typography variant="h5" className="mb-4 font-bold" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1, fontSize: '1.5rem' }}>🎯</Box>
                    抽奖配置信息
                  </Typography>
                  
                  {isDataLoading ? (
                    // 加载中状态
                    <Stack spacing={2}>
                      {[1, 2, 3].map((item) => (
                        <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box width={120} height={24}>
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px'
                              }}
                            />
                          </Box>
                          <Box width={80} height={24}>
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px'
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  ) : raffleInfo ? (
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>抽奖消耗FATE:</Typography>
                        <Chip 
                          label={`${raffleInfo.fate_cost || 0}`} 
                          color="secondary"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      <Divider />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>奖励等级:</Typography>
                      
                      {raffleInfo.rewards && raffleInfo.rewards.map((reward: any, index: number) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 1,
                          bgcolor: index === 0 ? '#FFF9C4' : index === 1 ? '#E1F5FE' : '#F1F8E9',
                          borderRadius: 1
                        }}>
                          <Typography>
                            {index === 0 ? '🥇 大奖' : index === 1 ? '🥈 二等奖' : '🥉 三等奖'}:
                          </Typography>
                          <Chip 
                            label={`${reward.amount || 0} FATE`} 
                            color={index === 0 ? 'warning' : index === 1 ? 'info' : 'success'}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">暂无配置信息</Typography>
                  )}
                </CardContent>
              </StyledCard>
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