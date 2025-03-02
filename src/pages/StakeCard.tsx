import { useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Row, Col, Statistic, Alert } from 'antd';
import { StakeByGrowVotes } from '../componnents/stake_by_grow_votes';
import { useCurrentAddress, useWalletStore } from '@roochnetwork/rooch-sdk-kit';

const { Text, Link } = Typography;

export const StakeCard = () => {
    const [poolInfo, setPoolInfo] = useState<any>(null);
    const [stakeInfo, setStakeInfo] = useState<any>(null);
    const [hasVotes, setHasVotes] = useState(true);
    const [projectName, setProjectName] = useState<string>('');
    const currentAddress = useCurrentAddress();
    const connectionStatus = useWalletStore((state) => state.connectionStatus);

    const { 
        QueryStakePoolInfo, 
        GetStakeInfo, 
        UpdateGrowVotes,
        Stake, 
        UnStake, 
        ClaimRewords,
        QueryProjectName 
    } = StakeByGrowVotes();

    const fetchPoolInfo = async () => {
        try {
            const [poolData, projectNameData] = await Promise.all([
                QueryStakePoolInfo(),
                QueryProjectName()
            ]);
            setPoolInfo(poolData);
            setProjectName(projectNameData as string);
        } catch (error) {
            console.error('获取质押池信息失败:', error);
        }
    };

    const fetchUserInfo = async () => {
        if (!currentAddress) return;

        try {
            await UpdateGrowVotes();
            const stakeData = await GetStakeInfo();
            setStakeInfo(stakeData);
            setHasVotes(true);
        } catch (error) {
            console.error('获取用户质押信息失败:', error);
            setHasVotes(false);
        }
    };

    useEffect(() => {
        fetchPoolInfo();
    }, []);

    useEffect(() => {
        if (currentAddress) {
            fetchUserInfo();
        }
    }, [currentAddress]);

    const formatDate = (timestamp: string) => {
        return new Date(parseInt(timestamp) * 1000).toLocaleString();
    };

    const handleStake = async () => {
        try {
            await Stake();
            fetchUserInfo();
        } catch (error) {
            console.error('质押失败:', error);
        }
    };

    const handleUnstake = async () => {
        try {
            await UnStake();
            fetchUserInfo();
        } catch (error) {
            console.error('解除质押失败:', error);
        }
    };

    const handleClaim = async () => {
        try {
            await ClaimRewords();
            fetchUserInfo();
        } catch (error) {
            console.error('领取奖励失败:', error);
        }
    };

    const renderUserStakeCard = () => {
        if (!currentAddress || connectionStatus !== "connected") {
            return (
                <Card title="我的质押" style={{ marginBottom: 16 }}>
                    <Alert
                        message="请先连接钱包"
                        type="info"
                        showIcon
                    />
                </Card>
            );
        }

        if (!hasVotes) {
            return (
                <Card title="我的质押" style={{ marginBottom: 16 }}>
                    <Alert
                        message="您还没有投票"
                        description={
                            <span>
                                请前往 <Link href={`https://grow.rooch.network/project/${projectName}`} target="_blank">Grow</Link> 为项目投票以获取质押票数
                            </span>
                        }
                        type="warning"
                        showIcon
                    />
                </Card>
            );
        }

        return (
            <Card title="我的质押" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Statistic 
                        title="已质押数量" 
                        value={stakeInfo?.stake_grow_votes || 0} 
                        suffix="票"
                    />
                    <Statistic 
                        title="待质押数量" 
                        value={stakeInfo?.fate_grow_votes || 0} 
                        suffix="票"
                    />
                    <Statistic 
                        title="待领取奖励" 
                        value={stakeInfo?.accumulated_fate || 0} 
                        suffix="FATE"
                    />
                    <Space>
                        <Button 
                            type="primary" 
                            onClick={handleStake}
                            disabled={!stakeInfo?.fate_grow_votes}
                        >
                            质押
                        </Button>
                        <Button 
                            onClick={handleUnstake}
                            disabled={!stakeInfo?.stake_grow_votes}
                        >
                            解除质押
                        </Button>
                        <Button 
                            type="primary" 
                            onClick={handleClaim}
                            disabled={!stakeInfo?.accumulated_fate}
                        >
                            领取奖励
                        </Button>
                    </Space>
                </Space>
            </Card>
        );
    };

    return (
        <div style={{ padding: 20 }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="质押池信息" style={{ marginBottom: 16 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Statistic 
                                title="总质押数量" 
                                value={poolInfo?.total_staked_votes || 0} 
                                suffix="票"
                            />
                            <Statistic 
                                title="每日产出" 
                                value={poolInfo?.fate_per_day || 0} 
                                suffix="FATE"
                            />
                            <Statistic 
                                title="总可挖取" 
                                value={poolInfo?.total_fate_supply || 0} 
                                suffix="FATE"
                            />
                            <div>
                                <Text>开始时间: {poolInfo ? formatDate(poolInfo.start_time) : '-'}</Text>
                            </div>
                            <div>
                                <Text>结束时间: {poolInfo ? formatDate(poolInfo.end_time) : '-'}</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col span={12}>
                    {renderUserStakeCard()}
                </Col>
            </Row>
        </div>
    );
};