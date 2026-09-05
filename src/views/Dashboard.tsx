import { Box, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import LoadingComponent from '../components/LoadingComponent';
import { useDashboardStore } from '../store/DashboardStore';
import { Status } from '../types/sharedEnums';

const LICENSE_WARNING_DAYS = 45;

type DashboardCardProps = {
  label: string;
  value: string;
  warning?: boolean;
};

function DashboardCard({ label, value, warning = false }: DashboardCardProps) {
  return (
    <Paper
      elevation={1}
      data-warning={warning ? 'true' : undefined}
      sx={{
        padding: 3,
        borderRadius: 2,
        backgroundColor: warning ? '#fff8e1' : '#ffffff',
        border: warning ? '1px solid #ffb300' : '1px solid transparent',
      }}
    >
      <Typography
        sx={{
          fontSize: '14px',
          color: warning ? '#e65100' : '#666666',
          fontWeight: 500,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant='h5'
        sx={{
          fontWeight: 700,
          color: warning ? '#e65100' : '#1a1a1a',
          fontSize: '28px',
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

function formatDashboardDate(date: string) {
  return dayjs(date).format('DD/MM/YYYY');
}

function Dashboard() {
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const dashboardLoadingStatus = useDashboardStore(
    (state) => state.dashboardLoadingStatus,
  );
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);

  useEffect(() => {
    if (dashboardLoadingStatus === Status.Idle) {
      fetchDashboard();
    }
  }, [dashboardLoadingStatus, fetchDashboard]);

  if (dashboardLoadingStatus === Status.Loading) {
    return <LoadingComponent />;
  }

  const showLicenseWarning =
    dashboardData !== null && dashboardData.daysLeft < LICENSE_WARNING_DAYS;

  const cards = dashboardData
    ? [
        {
          label: 'Days Left',
          value: String(dashboardData.daysLeft),
          warning: showLicenseWarning,
        },
        {
          label: 'Expiry Date',
          value: formatDashboardDate(dashboardData.expiryDate),
        },
        {
          label: 'Licenses Purchased',
          value: String(dashboardData.NoOfLicencedPurchased),
        },
        {
          label: 'Purchase Date',
          value: formatDashboardDate(dashboardData.purchaseDate),
        },
      ]
    : [];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h4' sx={{ fontWeight: 700, mb: 4 }}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {cards.map((card) => (
          <DashboardCard
            key={card.label}
            label={card.label}
            value={card.value}
            warning={card.warning}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Dashboard;
