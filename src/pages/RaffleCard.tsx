import { useEffect, useState } from 'react';
import { Card, Button, Space, Typography, message } from 'antd';
import { CheckIn } from '../componnents/check_in';
import { Raffle } from '../componnents/raffle';
import { useCurrentAddress } from '@roochnetwork/rooch-sdk-kit';

const { Text } = Typography;

export const RaffleCard = () => {
    const [checkInRecord, setCheckInRecord] = useState<any>(null);
    const [raffleConfig, setRaffleConfig] = useState<any>(null);
    const [raffleRecord, setRaffleRecord] = useState<any>(null);
    const currentAddress = useCurrentAddress();
    
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
        try {
            await GetWeekRaffle();
            fetchData();
        } catch (error) {
            console.error('每周抽奖失败:', error);
        }
    };

    const getPrizeLevel = (result: number, config: any) => {
        if (!result || !config) return null;

        const resultNum = Number(result);
        const grandWeight = Number(config.grand_prize_weight);
        const secondWeight = Number(config.second_prize_weight);
        const thirdWeight = Number(config.third_prize_weight);
        
        // 计算累积权重
        const totalWeight = grandWeight + secondWeight + thirdWeight;
        const normalizedResult = (resultNum / Number(config.max_raffle_count_weight)) * totalWeight;

        if (normalizedResult <= grandWeight) {
            return {
                level: 1,
                name: "特等奖",
                duration: Number(config.grand_prize_duration)
            };
        } else if (normalizedResult <= (grandWeight + secondWeight)) {
            return {
                level: 2,
                name: "二等奖",
                duration: Number(config.second_prize_duration)
            };
        } else {
            return {
                level: 3,
                name: "三等奖",
                duration: Number(config.third_prize_duration)
            };
        }
    };

    const handleFateRaffle = async () => {
        try {
            const result = await GetCheckInRaffleByFate();
            console.log('Fate抽奖结果:', result);
            
            // 添加类型检查
            if (result === undefined) {
                message.error('抽奖结果无效');
                return;
            }
            
            // 判断中奖等级
            const prizeLevel = getPrizeLevel(Number(result), raffleConfig);
            
            if (prizeLevel) {
                message.success(
                    `恭喜获得${prizeLevel.name}！获取${prizeLevel.duration}FATE`,
                    5
                );
            }
            
            fetchData();
        } catch (error) {
            console.error('Fate抽奖失败:', error);
            message.error('抽奖失败，请重试');
        }
    };

    const handleClaimMaxRaffle = async () => {
        try {
            await ClaimMaxRaffle();
            fetchData();
        } catch (error) {
            console.error('领取保底失败:', error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Card title="抽奖" style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* 每周抽奖按钮 */}
                    <div>
                        <Button 
                            type="primary" 
                            onClick={handleWeekRaffle}
                            disabled={parseInt(checkInRecord?.lottery_count || '0') === 0}
                        >
                            每周抽奖
                        </Button>
                        <Text style={{ marginLeft: 10 }}>
                            剩余次数: {checkInRecord?.lottery_count || 0}
                        </Text>
                    </div>

                    {/* Fate抽奖按钮 */}
                    <div>
                        <Button 
                            type="primary" 
                            onClick={handleFateRaffle}
                            // 移除 disabled 属性，让按钮始终可用
                        >
                            Fate抽奖
                        </Button>
                        <Text style={{ marginLeft: 10 }}>
                            已抽取次数: {raffleRecord?.raffle_count || 0}
                        </Text>
                    </div>

                    {/* 保底奖励按钮 */}
                    <div>
                        <Button 
                            type="primary" 
                            onClick={handleClaimMaxRaffle}
                            disabled={parseInt(raffleRecord?.raffle_count || '0') < 10}
                        >
                            领取保底奖励
                        </Button>
                        <Text style={{ marginLeft: 10 }}>
                            需要10次抽奖次数
                        </Text>
                    </div>

                    {/* 显示奖池信息 */}
                    {raffleConfig && (
                        <Card size="small" title="奖池信息">
                            <div>特等奖概率: {raffleConfig.grand_prize_weight}%</div>
                            <div>二等奖概率: {raffleConfig.second_prize_weight}%</div>
                            <div>三等奖概率: {raffleConfig.third_prize_weight}%</div>
                        </Card>
                    )}
                </Space>
            </Card>
        </div>
    );
};