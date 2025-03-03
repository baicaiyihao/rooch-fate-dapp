import { useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Table, Input, message } from 'antd';
import { Leaderboard } from '../componnents/leaderboard';
import { UserNft } from '../componnents/usernft'; // 引入 UserNft
import { useCurrentAddress, useRoochClient } from '@roochnetwork/rooch-sdk-kit';
import { RankTiersTableData } from '../type';
import { getCoinDecimals, formatBalance } from '../utils/coinUtils';
import { FATETYPE } from '../config/constants';

const { Text } = Typography;

export const LeaderboardCard = () => {
    const [rankings, setRankings] = useState<any>([]);
    const [userNftData, setUserNftData] = useState<any>(null); // 保存 QueryUserNft 的数据
    const [burnAmount, setBurnAmount] = useState<string>('');
    const currentAddress = useCurrentAddress();

    const { 
        QueryLeaderboardRankingsData,  // 获取 address 和 amount
        QueryLeaderboardRankTiers,     // 获取 rank 和 level 映射
        Burnfate
    } = Leaderboard();

    const { QueryUserNft } = UserNft(); // 使用 UserNft 的 QueryUserNft 方法

    // 获取排行榜数据
    const fetchRankingsData = async () => {
        try {
            const [rankingsData, rankTiersData] = await Promise.all([
                QueryLeaderboardRankingsData(),
                QueryLeaderboardRankTiers()
            ]);

            const sortedRankings = [...rankingsData].sort((a, b) => {
                const diff = BigInt(b.amount) - BigInt(a.amount);
                return diff > 0n ? 1 : diff < 0n ? -1 : 0;
            });

            const combinedData = sortedRankings.map((item, index) => {
                const rank = index + 1;
                return {
                    key: index,
                    rank,
                    address: item.address,
                    burnAmount: item.amount,
                    level: getLevelByRank(rank, rankTiersData)
                };
            });

            setRankings(combinedData);
        } catch (error) {
            console.error('获取排行榜数据失败:', error);
        }
    };

    // 获取用户 NFT 数据
    const fetchUserNftData = async () => {
        try {
            const userData = await QueryUserNft();
            setUserNftData(userData); // 如果成功，保存用户数据
        } catch (error) {
            console.error('获取用户 NFT 数据失败:', error);
            setUserNftData(null); // 如果失败，设置为 null
        }
    };

    // 根据排名获取对应的 level
    const getLevelByRank = (rank: number, tiers: RankTiersTableData[]) => {
        const tierInfo = tiers.find(tier => {
            const minRank = Number(tier.value.min_rank);
            const maxRank = Number(tier.value.max_rank);
            return rank >= minRank && rank <= maxRank;
        });
        return tierInfo ? Number(tierInfo.value.level) : '-';
    };

    const [fateBalance, setFateBalance] = useState<string>('0');
    const client = useRoochClient();

    // 缩短地址显示
    const shortenAddress = (address: string) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    // 表格列定义
    const columns = [
        {
            title: '排名',
            dataIndex: 'rank',
            key: 'rank',
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            render: (address: string) => shortenAddress(address),
        },
        {
            title: 'NFT等级',
            dataIndex: 'level',
            key: 'level',
        },
        {
            title: '已燃烧数量',
            dataIndex: 'burnAmount',
            key: 'burnAmount',
        },
    ];

    // 获取当前用户的排名
    const getCurrentUserRank = () => {
        const userAddress = currentAddress?.genRoochAddress().toHexAddress();
        const userRanking = rankings.find((item: { address: string | undefined; }) => item.address === userAddress);
        return userRanking?.rank || '-';
    };

    const fetchFateBalance = async () => {
        if (!currentAddress || !client) return;
        
        try {
            const decimals = await getCoinDecimals(client, FATETYPE);
            const balance = await client.getBalance({
                owner: currentAddress?.genRoochAddress().toHexAddress() || "",
                coinType: FATETYPE
            }) as any;
            setFateBalance(formatBalance(balance?.balance, decimals));
        } catch (error) {
            console.error('获取 FATE 余额失败:', error);
            setFateBalance('0');
        }
    };

    useEffect(() => {
        fetchRankingsData();
        fetchUserNftData();
        fetchFateBalance();
    }, [currentAddress]);

    // 修改 handleBurn，成功后刷新余额
    const handleBurn = async () => {
        if (!burnAmount || isNaN(Number(burnAmount))) {
            message.error('请输入有效的数量');
            return;
        }

        try {
            await Burnfate(Number(burnAmount));
            message.success('燃烧成功');
            await Promise.all([
                fetchRankingsData(),
                fetchUserNftData(),
                fetchFateBalance()
            ]);
            setBurnAmount('');
        } catch (error) {
            console.error('燃烧失败:', error);
            message.error('燃烧失败');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Card title="排行榜" style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
                <Card type="inner" title="我的信息" style={{ marginBottom: 16 }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Text>当前排名: {getCurrentUserRank()}</Text>
                        </div>
                        <div>
                            <Text>当前NFT等级: {userNftData?.level || '-'}</Text>
                        </div>
                        <div>
                            <Text>已燃烧数量: {userNftData?.burn_amount || '-'}</Text>
                        </div>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input
                                placeholder="输入要燃烧的FATE数量"
                                value={burnAmount}
                                onChange={e => setBurnAmount(e.target.value)}
                                style={{ width: 200 }}
                            />
                            <Text type="secondary">当前 FATE 余额: {fateBalance}</Text>
                            <Button 
                                type="primary" 
                                onClick={handleBurn}
                                disabled={!burnAmount || 
                                    Number(burnAmount) <= 0 || 
                                    Number(burnAmount) > Number(fateBalance)}
                            >
                                燃烧
                            </Button>
                        </Space>
                    </Space>
                </Card>

                {/* 排行榜表格 */}
                <Table 
                    columns={columns} 
                    dataSource={rankings}
                    pagination={false}
                />
            </Card>
        </div>
    );
};