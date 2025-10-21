# Tour Narration Audio Assets

This directory contains audio narrations for the Cleansheet Canvas UI tour system.

## Directory Structure

```
tour-narrations/
├── canvas-overview/     # Main canvas introduction and navigation
├── job-search/         # Job search workflow narrations
├── professional-tools/ # Professional tools and features
├── ui-controls/        # Interface controls and interactions
└── README.md          # This file
```

## File Naming Convention

**Format:** `{step-id}-{element-name}-{duration}s.mp3`

**Examples:**
- `welcome-canvas-intro-30s.mp3`
- `job-search-configure-alerts-45s.mp3`
- `professional-document-editor-60s.mp3`
- `ui-mindmap-navigation-25s.mp3`

## Audio Specifications

- **Format:** MP3 (universal browser support)
- **Duration:** 5-60 seconds per narration
- **Quality:** 128kbps (optimized for voice)
- **Sample Rate:** 44.1kHz
- **Channels:** Mono (voice narration)

## File Size Guidelines

- 5-15 seconds: ~60-180KB
- 15-30 seconds: ~180-360KB
- 30-45 seconds: ~360-540KB
- 45-60 seconds: ~540-720KB

Total estimated size for complete tour: 5-8MB

## Integration Notes

- Files loaded via Web Audio API
- Preloaded on tour initialization
- Played synchronously with Driver.js steps
- Error fallbacks for load failures

## Production Workflow

1. Record professional voice narrations
2. Edit and optimize audio files
3. Place in appropriate subdirectory
4. Update `AudioTourManager` mapping
5. Test cross-browser compatibility