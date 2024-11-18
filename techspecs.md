Original document: Tech spec notes for ICS 2023-12-21



Description-

The Rater software is a specialized data annotation and synchronization tool designed to support the development of DeeperEdge's M3A (multidimensional, multimodal movement atlas) technology. At its core, the software serves as a comprehensive platform for synchronizing, visualizing, and annotating multiple data streams - including video footage, audio waveforms, and approximately 126 channels of sensor data from wearable IMU devices. The primary purpose is to enable precise manual timestamping of movement events and facilitate expert rating of these movements for training classification algorithms. 
This will provide a training set to support automated timestamping and identification of movement events as well as automated rating of model-driven and data-driven quality metrics (such as flow, speed, stability, musicality, and even creativity) as well as biomechanical patterns. When included in a large database with extensive contextual metadata, these data may in turn be used to predict myriad cross-sectional features from skill level to fatigue state, and also support longitudinal models, from skill acquisition to injury risk.
The software combines features similar to video editing software with specialized analytical capabilities, allowing users to align different data channels, define movement clips, and annotate specific events with both predetermined and custom markers. A key component is the rating interface, which enables expert evaluators to verify movement classifications and provide detailed quality assessments using standardized metrics (such as GOE subcategories and component scores in figure skating) while maintaining efficient workflow through keyboard shortcuts and automated clip randomization. The system needs to be robust enough to handle large datasets (approximately 100 MB/hour of sensor data plus associated video) while providing an intuitive interface for both technical users managing data processing and expert raters focusing on movement analysis.

Page Architecture / Technology Stack-
TECHNOLOGY STACK
Frontend: Next.js 14 (App Router) with TypeScript
UI Components: shadcn/ui (built on Radix UI)
Backend: Firebase
- Authentication: Firebase Google Auth
- Database: Firestore
- Storage: Firebase Storage
Data Processing: Python scripts for heavy computation
Video Processing: react-player for video playback
Waveform Visualization: wavesurfer.js
Time Series Data: Recharts for sensor data visualization

CORE PAGES STRUCTURE
The application will follow a standard Next.js app router structure with these main sections:
- Google Sign-in page
- Project management (list, create, view projects)
- Session management (upload, sync, and edit sessions)
- Rating queue (manage and complete ratings)

KEY COMPONENTS
1. Session Editor
- Video player with timeline, clip length editor, including shift (editing of movement start/end) as well as scaling of clip length (with compression or expansion of time duration)
- Stick figure visualization
- Multi-channel sensor data visualization
- Audio waveform display
- Synchronization controls among video, audio, sensor, and other input formats
- Timestamp marker interface

2. Rating Interface
- Movement classification forms, with: 1) structured entry of labels, 2) ability to create new labels, 3) ability to show step(s) preceding and following current step, 4) rapid display of data (load whole set at once so can page through quickly)
- Expert rating input panels, with same characteristics as movement classification forms above
- Clip navigation controls, including randomization and anonymization of clips.
- Rating queue management

3. Validation Interface
Pulls up classified clips, users accept or reject clips

DATA FLOW
1. Raw data upload, MP4, MP3, NOITOM and Rokoko data files for sensor data → Firebase Storage
2. Python processing scripts → Generate initial sync points
3. Manual synchronization in web interface
4. Expert ratings stored in Firestore
5. Export processed data for ML training

MAIN FEATURES BY PRIORITY
1. Basic video/sensor sync capability
2. Timestamp marking system
3. Rating interface
4. Multi-user support
5. Export functionality
6. Data reshaping
7. Advanced analytics

SESSION EDITOR COMPONENT

Purpose:
A comprehensive interface for synchronizing and annotating multi-modal data streams including video, audio, sensor data, and 3D biomechanical visualization.

Main Layout Structure:
Top Section:
- Left Card: Video Player
- Right Card: Biomechanical Model
Bottom Section:
- Timeline Editor with multi-channel display

Key Features:

1. FILE UPLOAD & MANAGEMENT
- Support for multiple file types:
  - MP4 video files
  - MP3 audio files (separate from video)
  - Sensor data files (CSV/JSON)
- Progress indicators for uploads
- File validation and error handling
- File format interconversion

2. VIDEO PLAYER (Left Card)
- Custom controls for frame-by-frame navigation
- Timestamp overlay
- Playback speed control
- Current time display
- Screenshot capability
- capability of second synchronized video, such as second simultaneous view of current individual 
- capability of second comparison video (e.g. high rating or low rating of self or a standard sample) where either dynamic time warping (to align timing) or comparison of timing differences may be illustrated

3. BIOMECHANICAL MODEL (Right Card)
- OpenSim API integration
- Real-time 3D rendering of sensor data
- Camera controls for manual model viewing 
- Toggle for different anatomical views or YOLO-based match of current video pose
- Performance optimization for real-time updates
- edit synchronization with video

4. TIMELINE EDITOR (Bottom Section)
Components:
- Master timeline control
- Audio waveform visualization
- Configurable channel displays (6 visible at once)
- Channel selection interface

Synchronization Controls:
- Global lock/unlock for all channels
- Individual channel adjustments
- Reference point marking
- Offset adjustment tools
- Visual alignment guides

5. CHANNEL MANAGEMENT
- Channel selector panel
  - Grid view option for all 126 channels
  - Search/filter functionality
  - Group selection tools
  - Custom channel grouping
- Channel display options:
  - Color coding
  - Scale adjustment
  - Hide/show toggles
  - Custom labels

6. TIMESTAMP/ANNOTATION SYSTEM
- Single-click timestamp creation
- Batch timestamp tools
- Custom timestamp categories
- Export/import timestamp data
- Annotation text support
- Quick keyboard shortcuts

7. SYNCHRONIZATION WORKFLOW
State tracking needed for:
- Global lock status
- Active channel list
- Time offsets for video, audio, and sensor data
- Sync points with timestamps and channel offsets

8. STATE MANAGEMENT
- Track sync status of all channels
- Maintain timestamp history
- Handle undo/redo operations
- Auto-save functionality
- Session recovery

9. PERFORMANCE OPTIMIZATION
- Lazy loading for channel data
- Viewport-based rendering
- WebGL acceleration for 3D model
- Efficient memory management
- Background processing for heavy operations

UI Components needed (using shadcn/ui):
Top Section:
- Cards for video and model display
- Video player controls
- Model viewer controls

Timeline Section:
- Timeline component
- Waveform visualizer
- Channel display components

Controls:
- Sliders for timeline control
- Toggle buttons for locks
- Channel selector interface
- Standard buttons and controls (so can navigate entirely from keyboard or entirely from mouse)

Utility Components:
- Dialog boxes for settings
- Toast notifications for debugging feedback
- Tooltips for controls (such as lasso tool, pointer, etc.)

Key Interactions:
1. Upload files → Initialize timelines
2. Manual sync adjustments → Update all linked channels
3. Lock/unlock controls → Maintain relative positions
4. Timestamp creation → Mark all active channels
5. Channel selection → Update timeline display
6. Playback → Synchronized playback across all media

Additional Considerations:
- Real-time saving to Firebase
- Efficient data streaming for large files
- User permission management
- Error handling and recovery
- Cross-browser compatibility
- Mobile responsiveness (if required)
- Keyboard shortcuts for efficient workflow

RATING INTERFACE COMPONENT

Purpose:
A streamlined interface for expert raters to evaluate unclassified or pre-classified movement clips, applying standardized and custom ratings across synchronized video and sensor data channels.

Main Layout Structure:
- Left Card: Video Clip Player
- Right Card: Rating System Interface
  - Top: Step Type & Search
  - Middle: Rating Categories
  - Bottom: Universal Rating Buttons

Key Features:

1. CLIP MANAGEMENT
- Filtering Options:
  - By step type
  - By date
  - By performer (all individuals identified by code number; identifiable information stored in separate database)h
  - By rating status (rated/unrated)
  - By rating (e.g. all clips rated as 3)
- Clip Randomization:
  - Shuffle algorithm for unbiased rating
  - Option to view in sequence
  - Progress tracking
- Clip Queue System:
  - Auto-advance capability
  - Batch assignment
  - Review/revise previous ratings
  -  Assess intra-rater and inter-rater reliability among duplicate ratings, flag outliers for expert tie-breaker review.

2. VIDEO PLAYER (Left Card)
- Simple playback controls:
  - Play/pause
  - Speed adjustment
  - Loop functionality
  - Frame by frame navigation
- Clip Information Display:
  - Step type
  - Duration
  - Timestamp in original session
  - Clip ID
  - these characteristics may be hidden to anonymize identities
- toggle option for facial detection and blurring for anonymization

3. RATING SYSTEM (Right Card)
Step Type Management:
- Search bar for existing steps
- Step creation interface
  - Name
  - Description
  - Category
  - Associated ratings templates

Rating Categories:
- Hierarchical structure:
  - Step Type
    - Rating Category
      - Rating Scale
- Custom scale creation:
  - Numeric (1-10)
  - Boolean (yes/no)
  - Custom range
  - Text annotations

Universal Rating Buttons:
- Quick access error marking
- Performance flags
- Technical violation markers
- Common feedback options
- Custom quick-access buttons

4. DATA TAGGING SYSTEM
- Automatic tagging of:
  - Video clip
  - All 126 sensor channels
  - Associated metadata
- Rating timestamp recording
- Rater identification
- Rating confidence markers

5. USER INTERFACE ELEMENTS
Top Section:
- Step type selector
- Search functionality
- New step type creation
- Rating template management

Middle Section:
- Dynamic rating form
- Category organization
- Visual scale representations
- Comment fields

Bottom Section:
- Universal rating buttons
- Quick navigation controls
- Save/submit controls

6. WORKFLOW MANAGEMENT
Rating Session Flow:
1. Select step type filter (optional)
2. Initialize randomized queue
3. Load first clip
4. Display relevant rating categories
5. Input ratings
6. Auto-save and advance
7. Track progress

7. STATE MANAGEMENT
Track:
- Current clip status
- Rating progress
- Queue position
- Modified ratings
- Completion status

8. DATA STRUCTURE
Rating Template:
- Step type ID
- Rating categories
- Scale definitions
- Required fields

Rating Data:
- Clip reference
- Timestamp
- Rater ID
- Ratings values
- Comments
- Channel references

9. PERFORMANCE FEATURES
- Preload next clip
- Background saving
- Offline capability
- Rating validation
- Undo/redo support

10. ADDITIONAL FEATURES
- Batch rating tools
- Rating statistics
- Export functionality
- Rating comparison tools
- Quality control checks

Key Interactions:
1. Step Selection → Load Rating Template
2. Clip Loading → Display Relevant Ratings
3. Rating Input → Auto-save
4. Queue Navigation → Load Next Clip
5. Template Creation → Update Available Ratings
6. Universal Buttons → Quick Rating Application

Firebase Integration:
- Real-time rating updates
- User permission management
- Rating template storage
- Clip reference management
- Progress tracking
- Multi-user support

VALIDATION INTERFACE COMPONENT

Purpose:
A quality control interface for reviewing and validating previously classified and rated movement clips, ensuring accuracy and consistency in the dataset through a secondary review process.

Main Layout Structure:
- Left Card: Video Clip Review
- Right Card: Classification & Rating Review
- Bottom Bar: Validation Controls

Key Features:

1. CLIP QUEUE MANAGEMENT
Filtering Options:
- By step type
- By rating categories
- By rater
- By date range
- By validation status (unvalidated only)
- By confidence score
- By specific movements

Display Options:
- Random selection
- Sequential review
- Priority queue (flagged items)
- Batch grouping by type

2. VIDEO PLAYER (Left Card)
Playback Features:
- Standard playback controls
- Loop functionality
- Speed adjustment
- Frame-by-frame review
- Side-by-side comparison with "gold standard" examples

Meta Information:
- Original session details
- Classification timestamp
- Rater information
- Previous validation attempts

3. REVIEW DISPLAY (Right Card)
Classification Review:
- Step type assignment
- Confidence score
- Timestamp in original session
- Related movement patterns
- note that visualization of the stick figure may help to identify corrupted data, such as when foot is non-anatomically twisted around, when half of a step is missing due to data dropout, or when multiple steps are missing, frame shifting the data-driven step identification (e.g. based on automated music timing or step recognition)

Rating Review:
- All applied ratings displayed
- Rating scales used
- Rater comments
- Statistical comparison to similar clips
- Deviation flags from normal patterns

4. VALIDATION CONTROLS (Bottom Bar)
Action Buttons:
- Accept (validates and archives)
- Reject (returns to rating queue with notes)
- Edit (opens modified rating interface)
- Flag for review (marks for expert review)
- Add comments

Quick Actions:
- Batch validation for similar clips. For example, may show montage of multiple R swing rolls (displayed in the same pose). May wish to order swing rolls on the basis of rating, to see a gradient of quality from left to right.
- Template responses for common issues
- Shortcut keys for frequent actions

5. STATE MANAGEMENT
Track:
- Validation status
- Review history
- Modification log
- Reviewer ID
- Validation timestamp
- Quality control metrics

6. WORKFLOW FEATURES
Validation Process:
1. Load unvalidated clip
2. Display classifications and ratings
3. Review accuracy
4. Make validation decision
5. Add comments if needed
6. Save and advance to next clip
7. Track validation progress

7. QUALITY CONTROL TOOLS
Statistics Display:
- Validation rate
- Rejection patterns
- Rater consistency
- Inter-rater reliability
- Common error types
- Time spent per validation

8. USER INTERFACE ELEMENTS
Navigation Controls:
- Clip browser
- Queue management
- Progress tracking
- History navigation

Review Tools:
- Comparison views
- Reference materials
- Rating guidelines
- Validation checklist

9. DATA MANAGEMENT
Validation Data:
- Validator ID
- Timestamp
- Decision
- Comments
- Modifications
- Quality metrics

Archive Management:
- Validated clip storage
- Search functionality
- Export capabilities
- Audit trail

10. ADDITIONAL FEATURES
- Validation metrics dashboard
- Rater feedback system
- Training clip identification
- Pattern recognition for common errors
- Automated validation suggestions
- Clinical metadata (demographics, biometrics, documented skill level, etc.)

Key Interactions:
1. Clip Selection → Load Complete Rating Data
2. Review Process → Display All Classifications
3. Validation Decision → Update Status
4. Edit Function → Modified Rating Interface
5. Save Action → Remove from Queue

Firebase Integration:
- Real-time status updates
- Validation history tracking
- Multi-validator coordination
- Permission management
- Audit log maintenance
- Performance metrics storage

Special Considerations:
- Validator qualification tracking
- Conflict resolution system
- Quality threshold management
- Validation quota monitoring
- Performance analytics
- Training clip identification

FIREBASE BACKEND STRUCTURE

Purpose:
Efficient organization and retrieval of synchronized multi-modal data, including video, audio, sensor data, classifications, ratings, and validations.

1. MAIN COLLECTIONS HIERARCHY

Users Collection:
- User ID (auto-generated)
  - Email
  - Name
  - Role (admin/rater/validator)
  - Created At
  - Last Active
  - Active Projects Array

Projects Collection:
- Project ID (auto-generated)
  - Name
  - Description
  - Created By (user ID)
  - Created At
  - Updated At
  - Participant Info
  - Session Count
  - Access Control List
  - Step Types Array

Sessions Collection:
- Session ID (auto-generated)
  - Project ID
  - Video URL (Firebase Storage)
  - Audio URL (Firebase Storage)
  - Sensor Data URL (Firebase Storage)
  - Sync Points Array
  - Channel Count
  - Duration
  - Created At
  - Status
  - Channel Metadata
  - Clip Count

Clips Collection:
- Clip ID (auto-generated)
  - Session ID
  - Start Time
  - End Time
  - Step Type
  - Classifications Array
  - Status (unrated/rated/validated)
  - Rated By (user ID)
  - Validated By (user ID)
  - Created At
  - Channel Time Ranges
  - Rating Templates Array

Ratings Collection:
- Rating ID (auto-generated)
  - Clip ID
  - Rated By (user ID)
  - Rating Template ID
  - Rating Values Object
  - Timestamp
  - Channel Data References
  - Validation Status
  - Comments
  - Modified History

2. INDEXES TO CREATE

Primary Indexes:
- sessions_by_project: projectId, createdAt
- clips_by_session: sessionId, startTime
- ratings_by_clip: clipId, createdAt
- clips_by_status: status, stepType
- ratings_by_validator: validatedBy, timestamp

Compound Indexes:
- clips_search: stepType, status, createdAt
- ratings_analytics: stepType, ratedBy, timestamp
- session_management: projectId, status, createdAt
- validation_queue: status, stepType, createdAt

3. DATA RELATIONSHIPS

Session to Channels:
- Each session document contains metadata for all 126 channels
- Channel data stored in Firebase Storage
- Sync points stored as array in session document
- Channel visibility preferences stored in user settings

Clips to Ratings:
- Clips reference original session
- Maintain time ranges for video, audio, and all channels
- Ratings link back to clips
- Each rating can affect multiple channels

Step Types to Rating Templates:
- Step types contain array of possible rating templates
- Rating templates define structure of rating form
- Templates contain scale definitions and required fields

4. STORAGE ORGANIZATION

Firebase Storage Structure:
/projects/{projectId}/
  /sessions/{sessionId}/
    - video.mp4
    - audio.mp3
    - sensorData.json
    - processedData/
      - channel_{n}.json
    - thumbnails/
    - exports/

5. REAL-TIME SYNCHRONIZATION

Watch for changes:
- Rating status updates
- Validation queue modifications
- Session sync points
- Classification updates

6. SECURITY RULES

Base Rules:
- Only authenticated users can read/write
- Admins have full access
- Raters can only create/edit ratings
- Validators can only validate
- Users can only access assigned projects
- record of permissions granted for data use

7. OPTIMIZATION STRATEGIES

Data Access:
- Pagination for clips and ratings
- Lazy loading of channel data
- Caching frequently accessed data
- Batch writes for ratings
- Efficient querying using indexes

Storage:
- Compressed sensor data
- Chunked channel data
- Progressive video loading
- Thumbnail generation

8. BACKUP AND RECOVERY

Regular Backups:
- Daily backup of Firestore
- Weekly backup of Storage
- Version control for rating templates
- Audit logs for all changes

This structure allows for:
- Efficient retrieval of clips for rating
- Quick validation queue population
- Easy export of rated data
- Scalable storage of sensor data
- Flexible rating template system
- Robust user permission management
- Comprehensive activity tracking
- Performance optimization
MOVEMENT WINDOW TAGGING SYSTEM
TIMESTAMP WINDOWS STRUCTURE Collection: movementWindows/
windowId (auto-generated)
sessionId
stepType
startTime (in milliseconds)
endTime (in milliseconds)
channelData: { channelId: { values: [...array of values during window], sampleRate: number, startIndex: number, endIndex: number } }
videoReference: { startFrame: number, endFrame: number fps: number }
ratings: { ratingTemplateId: { value: number, ratedBy: userId, timestamp: date } }
STEP TYPES MANAGEMENT Collection: stepTypes/
stepTypeId (auto-generated)
name: string
description: string
defaultWindowSize: number (in milliseconds)
ratingTemplates: [ { name: string, scale: {min: number, max: number}, description: string } ]
channelImportance: { channelId: weightValue }
DATA CAPTURE WORKFLOW When a user marks a movement window:
Frontend captures:
Start and end time of movement
All 126 channel values within that window
Video frames within window
Current step type classification
Any immediate ratings
Data Processing:
Window data is normalized to consistent sample rate
Values are stored as arrays for each channel
Indexes are stored for quick retrieval
Metadata calculated (average values, peaks, etc.)
Storage Process:
Window metadata stored in Firestore
Raw channel data stored in Firebase Storage if over size limit
References maintained in window document
QUERYING AND RETRIEVAL Index Structure:
sessionId_stepType_startTime
stepType_rating_timestamp
sessionId_channelId_timeRange
This enables:
Quick retrieval of all windows of specific step type
Filtering by rating values
Time-based queries within sessions
Channel-specific analysis
ML TRAINING DATA EXPORT Export Structure: { windowId: { stepType: string, channelData: { ch1: [...values], ch2: [...values], ... }, ratings: { quality: number, technical: number, ... }, metadata: { duration: number, timestamp: date, performer: string } } }
REAL-TIME UPDATES
Windows can be modified in real-time
Ratings can be added/modified
Step types can be created/modified
Rating templates can be adjusted
PERFORMANCE CONSIDERATIONS For 1-3 second windows:
Approximately 300-900 data points per channel
126 channels = 37,800-113,400 total points per window
Data compression for storage
Caching for frequent access
Batch processing for ML exports
RATING SYSTEM INTEGRATION Each window can have:
Multiple rating types
Multiple raters
Rating history
Validation status
Quality metrics
Example Window Document:
Copy
{
  "windowId": "window123",
  "sessionId": "session456",
  "stepType": "forward3Turn",
  "startTime": 1234567890,
  "endTime": 1234569890,
  "channelData": {
    "ch1": {
      "storageRef": "path/to/storage",
      "summary": {
        "mean": 0.5,
        "max": 1.2,
        "min": 0.1
      }
    }
  },
  "ratings": {
    "quality": {
      "value": 8.5,
      "ratedBy": "user789",
      "timestamp": "2024-01-20T..."
    }
  },
  "metadata": {
    "confidence": 0.95,
    "validated": true,
    "validatedBy": "user012"
  }
}
This structure allows for:
Efficient storage of large amounts of sensor data
Quick retrieval for rating interface
Flexible addition of new step types and ratings
Easy export for ML training
Comprehensive tracking of window metadata
Real-time updates and modifications
Performance optimization for large datasets


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Overview of software components
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

python for logic
Database backend
acquisitions ~100 Mb/h + associated video
demographic, metadata, data management (sharing, history, etc.)
In-house interface 
data visualization - like standard video editing software (can align different channels, define clips, annotate)
generate stick figure
mark data (beginning, end, features)
synch video, data, ? audio
manual classification of step identity (actually, can pre-define step identity on the basis of timing to provide a preliminary classification that can be manually edited)
Pre-specified features of interest - peak of jump, toe point, air position, foot strike
Free-form notes - e.g. “good example of ____”
synch video, data
choose what file, what channel, what time segment to show
keyboard commands to jump to markings
data organization (naming, enter metadata)
List all data files
Tag files with categories
Type of file, e.g. dutch waltz
Customizable groups, e.g. things that are in ¾, things including swing rolls, etc.
On ice vs off ice
Location: WR vs ER vs wellesley vs old SCOB
Tag files with processing that has been done
data processing 
template - choose elements for template
comparison - choose error metric
classification - nearest neighbor, voting scheme, etc.
Visualization of processed data
Show entire recording (126 rows?)
Show just the skating parts (just exons, still 126 rows?)


Rater interface
Define beginning and end


verification of step identity
approve suggested step
choose a new one from a list, should be able to add new step to list
add notes, e.g. small stumble, was late, etc.
rating of step (or whole pattern at once)
GOE subcategories
Component score subscores
ability to add new categories
other features:
allow manual zooming into video, stick figure
keyboard shortcuts also
workflow of tasks for a rater to do
back end - randomize clips into sets
End-user interface
Summaries
Sharing
Gamification 
Future directions
Saving sensor data to phone 
Synch data and video
Sensor-embedded smart, washable textiles
Dimensional reduction algorithms hard coded into sensors to reduce data amt
CAPTURE INTERFACE COMPONENT
Purpose: Real-time data capture interface for collecting synchronized sensor data from either Rokoko smartsuit or Mbientlab sensors, along with video recording, all synchronized and stored in our database structure.
DEVICE CONNECTION MANAGEMENT Rokoko Integration:
Bluetooth connection handling
API endpoints for real-time data streaming
Sensor calibration interface
Battery status monitoring
Connection status display
Data streaming rate monitoring
Mbientlab Integration:
Multiple sensor connection handling (up to 17 sensors)
MetaWear API integration
Individual sensor battery monitoring
Sensor calibration tools
Data streaming configuration
Connection quality indicators
CAPTURE INTERFACE LAYOUT Top Section:
Device connection status panel
Recording controls
Session information input
Calibration controls
Battery status indicators
Main Display:
Left Card: Live video preview
Right Card: Real-time 3D model visualization
Bottom Card: Live sensor data streams visualization
Control Panel:
Start/Stop recording
Mark timestamps
Add session notes
Emergency stop
Quick calibration access
REAL-TIME MONITORING Data Visualization:
Live sensor data graphs
Frame rate monitoring
Data integrity checks
Dropout detection
Streaming quality indicators
Buffer status
RECORDING WORKFLOW Pre-Recording:
Device connection check
Calibration verification
Storage space verification
Session metadata input
Video setup confirmation
During Recording:
Real-time data backup
Drop frame monitoring
Battery level alerts
Storage space monitoring
Time elapsed tracking
Event marking system
Post-Recording:
Data integrity verification
Initial processing status
Quick preview generation
Upload status to Firebase
Session summary generation
DATA HANDLING Real-time Processing:
Sensor data buffering
Video stream handling
Time synchronization
Data compression
Error checking
Dropout compensation
Storage Management:
Local temporary storage
Cloud upload management
Backup procedures
Cache management
Storage space monitoring
CONFIGURATION OPTIONS Sensor Settings:
Sampling rate configuration
Sensor placement verification
Calibration profiles
Data filtering options
Streaming quality settings
Video Settings:
Resolution selection
Frame rate configuration
Codec selection
Storage format options
Camera selection
ERROR HANDLING Connection Issues:
Auto-reconnection attempts
Data recovery procedures
Backup recording options
Error logging
User notifications
Data Recovery:
Auto-save functionality
Session recovery tools
Partial data salvaging
Backup restoration
Synchronization recovery
INTEGRATION WITH MAIN SYSTEM Data Processing:
Convert to standard format
Generate preview clips
Create initial timestamps
Process for session editor
Generate metadata
Database Integration:
Real-time session creation
Progressive data upload
Metadata synchronization
User association
Project linking
USER FEEDBACK Visual Indicators:
Connection status
Recording status
Battery levels
Storage space
Data quality
Processing status
Alert System:
Connection issues
Low battery
Storage warnings
Data quality issues
Processing errors
PERFORMANCE OPTIMIZATION Real-time Processing:
Buffer management
Memory optimization
CPU usage monitoring
Background processing
Resource allocation
Data Streaming:
Bandwidth optimization
Compression algorithms
Quality scaling
Priority queuing
Load balancing
Key Technical Requirements:
Rokoko API:
Bluetooth connectivity
Real-time data streaming
Calibration functions
Data format handling
Mbientlab Integration:
MetaWear API
Multi-sensor management
Data synchronization
Custom firmware support
Video Capture:
WebRTC implementation
Camera API handling
Video compression
Frame synchronization




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Vision - How to use m-space
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Step 1: collect data
Step 2: separate dances into individual steps
Step 3: map steps into m-space (preferably 2-dimensional or 3-dimensional for easier visualization)
Assumption: movements that are similar will cluster in m-space
Application #1: Step classification. Location in m-space will identify what step it is
Application #2: Step rating. Location within the step cluster/manifold will identify what attributes that particular step had, i.e. how was its “form”?
Step 4: look for trends, such as moving closer to or farther from ideal form in m-space 
Is your form improving? → keep up the good work!
Is your form worsening? → uh-oh, you might be at risk for injury. Look more closely at specifics of your poor form that may suggest muscle groups that are dysfunctional.


To make all this happen:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SBIR PHASE 1
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Stage 0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Database back end to hold data
Rater interface is the “rate-limiting step”


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Stage 1 - General plan for building m-space, using brute force. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
BFStep 1: collect data – all dances, all possible user differences (body size, skill level, technical approach, etc.). (In reality may start with a subset of manual labels and ratings in hopes that Stage 2 may label and rate everything semi-automatically.)
BFStep 2: separate dances into individual steps – manually annotate data trace by watching synched video.
BFStep 3: assign ratings for each individual step – computer presents video clips of each step separately, expert rater clicks on list of ~10 attributes on a scale of 1-10 (increments of 0.25)
BFStep 4: map steps into a dimensionally reduced “m-space” 
Different steps will cluster into different regions of m-space
Within an individual step’s cluster (manifold), different locations will represent different combinations of attributes (ratings)


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Stage 2 - simple template-based separation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
How to perform build m-space more efficiently and elegantly:
TBSStep 1: collect data strategically to determine variability – a few people do all dances (many dances, less performance variability); all people do just one dance (the Dutch Waltz, one dance, extreme performance variability);` some people do some dances (look at performance variability in a few examples).
TBSStep 2: automatically separate dances into individual steps using time. Each of the following components should be modular to accommodate future advances from the R&D components.
Create: “perfect canonical” templates of each step. Originally, this will consist of ultra-elite, world-class skaters. R&D component: Ultimately, we may find that categorization is much easier if we use personalized templates (how much voice sampling is necessary to train Dragon Naturally Speaking). However, an intermediate option is to pre-select a template class (or run a sample of your data to choose the closest template class), such as a template class representing the same age, height, etc.
Compare: The step-to-be-identified is compared against the canonical templates of all known steps, currently the Euclidean root-mean-square distance. R&D component: Need to find an appropriate comparison metric. PCA is just a linear transform; other transforms may separate clusters better, other error metrics/cost functions may provide better results.
Categorize: which canonical step should you inherit your step classification from? Currently we take the nearest step (smallest distance/error metric). R&D component: Need to find a more sophisticated method because step clusters/manifolds are not normally distributed. Voting scheme? Dictionary method? Need to understand distribution of how individuals perform steps.
TBSStep 3: manually validate the identity of each step. Crowdsource to interested ice dancers? R&D component: Show that presentation of steps does not need to be randomized. Consider mass methodology in which a montage of many examples of a single step are shown – it will be obvious if one of the steps is not like the others. If relatively accurate, consider spot checking a randomized subset.
TBSStep 4: select a subset of points that are distributed across a given step-manifold. Manually assign ratings to these steps



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SBIR PHASE 2 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Stage 3 - bootstrapped separation beyond known steps
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
BSSStep 1: collect new data, some from pattern dances (pre-defined steps and timing), some from free dance (timing and performance varies widely). R&D component: Consider addition of free skate elements.
BSSStep 2: use optimized template-based separation from Stage 2, together with dynamic time warping. R&D component: Identify which steps are known and which are unknown.
BSSStep 3: manually identify unknown steps selectively presented. R&D component: See if their location in m-space could have been predicted. 
BSSStep 4: See if m-space needs to be re-defined. With the addition of new dance data, recreate m-space. See how far the average distances are between a location in new m-space and a location in old m-space. R&D component: Can subsample m-space both randomly and determinatively (choose different categories – dance identities, step ratings, skater attributes, etc.) to see how much m-space is affected. Perform power calculation to determine sparsest collection necessary to define m-space.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Stage 4 - data-driven machine learning-based separation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Once a larger labeled training set is available, can be used to train algorithm, refine, iterate.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Stage 5 - modeling of streamlines within step-manifolds   
****DURING SBIR PHASE I IF POSSIBLE****
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Separate data so that you are considering only one step at a time and one ratings attribute at a time. Start in existing m-space. 
Hypothesis 1: We hypothesize that there is some sort of “origin,” e.g. when the person is still. 
Hypothesis 2: We hypothesize that relative to the performance of a middle-level skater, “perfection,” will be farther away from the origin?
Hypothesis 3: We hypothesize that reformulation of a new m-space specific to a given step-manifold may be necessary to optimally represent certain modes of attribute variation.
Hypothesis 4: We hypothesize that a scale for a given attribute can be empirically defined along the manifold surface
Hypothesis 5: We hypothesize that attribute level sets from different step manifolds can be mapped to each other.
Hypothesis 6: We hypothesize that injury risk can be represented by attribute level sets. 
