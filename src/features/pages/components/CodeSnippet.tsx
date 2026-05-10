import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Switched to vscDarkPlus for a modern dark look
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
    code: string;
    language: string;
}

export const CodeSnippet: React.FC<Props> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{
            position: 'relative',
            my: 3,
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#252525',
        }}>
            {/* Header / Toolbar */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 0.75,
                backgroundColor: '#252525',
                borderBottom: '2px solid',
                borderColor: 'background.default'
            }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: 'Monospace',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.5)',
                        letterSpacing: '0.05rem'
                    }}
                >
                    {language.toLowerCase()}
                </Typography>

                <Tooltip title={copied ? "Copied!" : "Copy code"} arrow>
                    <IconButton
                        size="small"
                        onClick={handleCopy}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                    >
                        {copied ? (
                            <CheckIcon fontSize="small" sx={{ color: '#4caf50' }} />
                        ) : (
                            <ContentCopyIcon fontSize="small" />
                        )}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Syntax Highlighter */}
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '20px',
                    fontSize: '0.925rem',
                    backgroundColor: 'transparent',
                    lineHeight: '1.5',
                }}
            >
                {code}
            </SyntaxHighlighter>
        </Box>
    );
};