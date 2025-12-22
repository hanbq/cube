import React from 'react';
import Header from './Header';
import Main from './Main';
import Menu from './Menu';
import { Box, Container, Grid } from '@mui/material';

export default class Home extends React.Component {
  render() {
    return (   
      <Box 
          sx={{
            width: '100vw',      // 视口宽度
            height: '100vh',     // 视口高度
            position: 'fixed',   // 固定定位
            top: 0,              // 顶部对齐
            left: 0,             // 左侧对齐
            overflow: 'auto'     // 内容溢出时显示滚动条
          }}
        >
        <Grid container spacing={0.5}>  
            <Grid size={12}>
                 <Header />
            </Grid>
            <Grid size={2}>
                 <Menu />
            </Grid>
            <Grid size={10}>
                <Main />
            </Grid>
        </Grid>
      </Box>
    )
  }
}