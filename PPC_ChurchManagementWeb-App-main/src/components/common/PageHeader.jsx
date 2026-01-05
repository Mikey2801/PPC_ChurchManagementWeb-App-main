import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  actionText,
  onAction
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography 
                key={crumb.text} 
                color="text.primary"
                fontWeight={500}
              >
                {crumb.text}
              </Typography>
            ) : (
              <Link
                key={crumb.text}
                component={RouterLink}
                to={crumb.href}
                color="text.secondary"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {crumb.text}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
              mb: subtitle ? 1 : 0
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && onAction && (
          <Button
            variant="contained"
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader; 