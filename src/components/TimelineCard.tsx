import React from 'react';
import WaveformVisualizer from './WaveformVisualizer';

interface TimelineCardProps {
  fileType: string;
  file: {
    fileId: string;
    fileUrl: string;
    fileName: string;
  };
}

const TimelineCard: React.FC<TimelineCardProps> = ({ fileType, file }) => {
  console.log('TimelineCard rendering:', { fileType, file });

  if (!file || !file.fileUrl) {
    return null;
  }

  return (
    <div className="timeline-card" style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '4px',
      margin: '10px',
      backgroundColor: '#fff'
    }}>
      {fileType === 'audio' && (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{file.fileName}</h3>
          </div>
          
          <div style={{ 
            width: '100%',
            border: '1px solid #eee',
            borderRadius: '4px',
            padding: '15px',
            backgroundColor: '#f9f9f9'
          }}>
            <WaveformVisualizer 
              audioUrl={file.fileUrl}
              onReady={() => console.log('Waveform ready')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineCard; 