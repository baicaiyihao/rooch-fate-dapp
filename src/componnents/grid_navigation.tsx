import { Grid, Paper, Typography, Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion"; // 引入framer-motion
import { cn } from "../utils/cn"; 
// 定义浮动动画
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// 创建带有浮动动画的Paper组件
const AnimatedPaper = styled(Paper)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

// 导航卡片类型定义
export interface NavigationCard {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
  width?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  height?: number | string; // 添加高度属性
}

interface GridNavigationProps {
  cards: NavigationCard[]; 
  // 添加默认宽度占比属性
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  defaultHeight?: number | string; // 添加默认高度属性
  fullWidth?: boolean;
}

export function GridNavigation({ 
  cards, 
  xs = 12, 
  sm = 6, 
  md = 6, 
  lg = 6 ,
  defaultHeight = '180px' ,// 设置默认高度
  fullWidth = false
}: GridNavigationProps) {
  return (
    <div 
    style={{ 
      width: fullWidth ? '100vw' : '100%',
      position: fullWidth ? 'relative' : 'static',
      left: fullWidth ? '50%' : 'auto',
      transform: fullWidth ? 'translateX(-50%)' : 'none',
      marginLeft: fullWidth ? '0' : 'auto',
      marginRight: fullWidth ? '0' : 'auto',
      boxSizing: 'border-box'
    }}
  >
    <Grid container spacing={3} className="mb-8" sx={{ maxWidth: '1200px', margin: '0 auto' }}>
    {cards.map((card, index) => (
      <Grid 
        item 
        xs={card.width?.xs || xs} 
        sm={card.width?.sm || sm} 
        md={card.width?.md || md} 
        lg={card.width?.lg || lg} 
        key={index}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <AnimatedPaper 
            elevation={1} 
            className="p-6 h-full cursor-pointer"
            sx={{ 
              borderRadius: '12px',
              border: '1px solid #eaeaea',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
                minHeight: card.height || defaultHeight, 
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={card.onClick}
            delay={`${index * 0.5}s`}
          >
            {/* 添加背景光效 */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            <Box className="mb-2 text-2xl relative z-10">{card.icon}</Box>
            <Typography variant="h5" component="h2" className="font-bold mb-2 relative z-10">
              {card.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" className="relative z-10">
              {card.description}
            </Typography>
          </AnimatedPaper>
        </motion.div>
      </Grid>
    ))}
  </Grid>
  </div>
  );
}