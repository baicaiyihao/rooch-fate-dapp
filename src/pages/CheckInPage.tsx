import { LoadingButton } from "@mui/lab";
import { Button, Card, CardContent, Divider, Stack, Typography, Box, Chip } from "@mui/material";
import { useCurrentAddress } from "@roochnetwork/rooch-sdk-kit";
import { useState, useEffect } from "react";
import { CheckIn } from '../componnents/check_in';
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";

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

function CheckInPage() {
  const currentAddress = useCurrentAddress();
  const [loading, setLoading] = useState(false);
  const [checkInRecord, setCheckInRecord] = useState<any>(null);
  const [checkInConfig, setCheckInConfig] = useState<any>(null);

  const {
    CheckIn: handleCheckIn,
    GetWeekRaffle,
    QueryDailyCheckInConfig,
    QueryCheckInRecord,
  } = CheckIn();

  // 获取签到记录和配置
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await QueryDailyCheckInConfig();
        setCheckInConfig(config);
        
        const record = await QueryCheckInRecord();
        setCheckInRecord(record);
      } catch (error) {
        console.error("获取签到数据失败:", error);
      }
    };

    if (currentAddress) {
      fetchData();
    }
  }, [currentAddress]);

  // 处理签到
  const onCheckIn = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await handleCheckIn();
      console.log('签到结果:', result);
      
      // 重新获取签到记录
      const record = await QueryCheckInRecord();
      setCheckInRecord(record);
    } catch (error) {
      console.error("签到失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理周抽奖
  const onWeekRaffle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await GetWeekRaffle();
      console.log('周抽奖结果:', result);
    } catch (error) {
      console.error("周抽奖失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <Stack
        className="font-sans min-w-[1024px]"
        direction="column"
        sx={{
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-8">
          <Button variant="outlined" onClick={() => window.history.back()}>
            返回首页
          </Button>
          <Typography variant="h4" className="font-bold">
            每日签到
          </Typography>
          <Box width={100} /> {/* 占位元素，保持标题居中 */}
        </Stack>

        <Card elevation={3} className="mb-8">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold">
              签到状态
            </Typography>
            
            {checkInRecord ? (
              <Stack spacing={2}>
                <Typography>
                  总签到天数: <Chip label={checkInRecord.total_sign_in_days} color="primary" />
                </Typography>
                <Typography>
                  连续签到天数: <Chip label={checkInRecord.continue_days} color="success" />
                </Typography>
                <Typography>
                  上次签到时间: {new Date(Number(checkInRecord.last_sign_in_timestamp) * 1000).toLocaleString()}
                </Typography>
                <Typography>
                  抽奖次数: <Chip label={checkInRecord.lottery_count} color="secondary" />
                </Typography>
              </Stack>
            ) : (
              <Typography>加载签到记录中...</Typography>
            )}
          </CardContent>
        </Card>

        <Card elevation={3} className="mb-8">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold">
              签到奖励
            </Typography>
            
            {checkInConfig ? (
              <Stack spacing={2}>
                <Typography>
                  最大连续签到天数: <Chip label={checkInConfig.max_continue_days} color="primary" />
                </Typography>
                <Typography variant="h6" className="mt-2">每日奖励:</Typography>
                <Box className="flex flex-wrap gap-2">
                  {checkInConfig.daily_rewards.map((reward: any, index: number) => (
                    <Chip 
                      key={index}
                      label={`第${index + 1}天: ${reward}`}
                      color={index < checkInRecord?.continue_days ? "success" : "default"}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Stack>
            ) : (
              <Typography>加载签到配置中...</Typography>
            )}
          </CardContent>
        </Card>

        <Stack direction="row" spacing={3} justifyContent="center" className="mt-4">
          <LoadingButton
            variant="contained"
            color="primary"
            size="large"
            loading={loading}
            onClick={onCheckIn}
            disabled={checkInRecord && new Date(Number(checkInRecord.last_sign_in_timestamp) * 1000).toDateString() === new Date().toDateString()}
          >
            {checkInRecord && new Date(Number(checkInRecord.last_sign_in_timestamp) * 1000).toDateString() === new Date().toDateString() 
              ? "今日已签到" 
              : "立即签到"}
          </LoadingButton>
          
          <LoadingButton
            variant="outlined"
            color="secondary"
            size="large"
            loading={loading}
            onClick={onWeekRaffle}
            disabled={!checkInRecord || checkInRecord.lottery_count <= 0}
          >
            领取周抽奖 ({checkInRecord?.lottery_count || 0})
          </LoadingButton>
        </Stack>
      </Stack>
    </>
  );
}

export default CheckInPage;