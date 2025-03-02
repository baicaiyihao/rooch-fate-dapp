import { useEffect, useState } from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { CheckIn } from '../componnents/check_in';
import { useCurrentAddress } from '@roochnetwork/rooch-sdk-kit';

const { Text } = Typography;

export const CheckInCard = () => {
    const [config, setConfig] = useState<any>(null);
    const [record, setRecord] = useState<any>(null);
    const currentAddress = useCurrentAddress();
    const { CheckIn: doCheckIn, QueryDailyCheckInConfig, QueryCheckInRecord } = CheckIn();

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
            const configData = await QueryDailyCheckInConfig();
            const recordData = await QueryCheckInRecord();
            
            // 检查并设置数据
            if (configData) {
                setConfig(configData);
            }
            
            if (recordData) {
                setRecord(recordData);
                console.log('签到记录:', recordData);
            }
        } catch (error) {
            console.error('获取数据失败:', error);
        }
    };

    const renderDayButton = (day: number) => {
        // 确保 record 存在且有 continue_days 值
        const continueDays = record?.continue_days ? parseInt(record.continue_days) : 0;
        const isChecked = continueDays >= day;
        const reward = config?.daily_rewards?.[day - 1];

        return (
            <Card
                size="small"
                style={{
                    width: 100,
                    textAlign: 'center',
                    backgroundColor: isChecked ? '#f0f8ff' : 'white',
                    border: isChecked ? '1px solid #1890ff' : '1px solid #d9d9d9'
                }}
            >
                <div>Day {day}</div>
                <div>{reward || 0} FATE</div>
                {isChecked && <div style={{ color: '#1890ff' }}>已签到</div>}
            </Card>
        );
    };

    // 添加判断是否同一天的函数
    const isSameDay = (timestamp: string) => {
        const lastSignInDate = new Date(parseInt(timestamp) * 1000);
        const now = new Date();
        return lastSignInDate.getFullYear() === now.getFullYear() &&
            lastSignInDate.getMonth() === now.getMonth() &&
            lastSignInDate.getDate() === now.getDate();
    };

    // 判断今天是否已签到
    const hasSignedToday = record?.last_sign_in_timestamp && 
        isSameDay(record.last_sign_in_timestamp);

    const handleCheckIn = async () => {
            try {
                await doCheckIn();
                // 签到后刷新数据
                fetchData();
            } catch (error) {
                console.error('签到失败:', error);
            }
        };
    
        return (
            <div style={{ padding: 20 }}>
                <Card title="每日签到" style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Button 
                            type="primary" 
                            onClick={handleCheckIn}
                            disabled={hasSignedToday || parseInt(record?.continue_days) === 7}
                        >
                            {hasSignedToday ? '已签到' : '签到'}
                        </Button>

                        <div>
                            <Text>已连续签到: {parseInt(record?.continue_days) || 0} 天</Text>
                        </div>

                        {/* 签到奖励展示 */}
                        <Space wrap>
                            {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                <div key={`day-${day}`}>
                                    {renderDayButton(day)}
                                </div>
                            ))}
                        </Space>

                        {/* 七天奖励按钮 */}
                        {record?.continue_days === 7 && (
                            <Button type="primary">
                                领取七天奖励
                            </Button>
                        )}
                    </Space>
                </Card>
            </div>
        );
        
};
