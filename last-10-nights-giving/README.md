# Last 10 Nights Giving Platform

![Last 10 Nights Giving Platform](https://via.placeholder.com/800x400?text=Last+10+Nights+Giving+Platform)

A comprehensive donation management platform designed for Ramadan's last 10 nights, enabling Muslims to maximize their charitable giving during this spiritually significant period.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Email Notification System](#email-notification-system)
- [External Donation Tracking](#external-donation-tracking)
- [Donation Scheduling](#donation-scheduling)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

The Last 10 Nights Giving Platform is a React-based web application that helps Muslims organize, track, and maximize their charitable donations during the last 10 nights of Ramadan. This period is considered especially blessed in Islamic tradition, with one night (Laylatul Qadr) being more valuable than a thousand months of worship.

The platform allows users to:
- Make quick donations to various charities
- Schedule donations for specific nights
- Track external donations made directly on charity websites
- Visualize donation history and progress
- Set goals for each of the last 10 nights

## ✨ Features

### 🔄 Quick Donation
- Simple form for making immediate donations
- Support for multiple charities and causes
- Instant confirmation and receipt

### ⏱️ Donation Scheduler
- Schedule donations for specific nights
- Set up recurring donations
- Email reminders for scheduled donations
- Customizable notification times

### 🌐 External Donation Tracking
- Track donations made directly on charity websites
- Generate unique tracking IDs with UTM parameters
- Process webhook callbacks from charity platforms
- Input donation amounts for accurate reporting

### 📊 Donation Analytics
- Visual breakdown of donations by night
- Progress tracking toward nightly goals
- Comprehensive donation history with filtering options
- Conversion rate tracking for external donations

### 🏢 Charity Directory
- Curated list of verified charities
- Detailed information about each charity's mission and impact
- Direct links to charity websites with tracking

## 🛠️ Technology Stack

### Frontend
- **React 19**: Core UI library
- **Vite**: Build tool and development server
- **React Bootstrap**: UI component library
- **Context API**: State management
- **localStorage**: Client-side data persistence
- **EmailJS**: Email notification service

### Key Dependencies
- `react` & `react-dom`: Core React libraries
- `react-bootstrap`: UI component framework
- `react-bootstrap-icons` & `react-icons`: Icon libraries
- `bootstrap`: CSS framework
- `emailjs-com`: Email notification service

## 🏗️ Architecture

### Component Structure
- **App**: Main application container
- **DonationContext**: Global state management for donation data
- **CharitiesTab**: Displays charity list and handles external donation tracking
- **QuickDonationForm**: Handles immediate donations
- **DonationScheduler**: Manages scheduled donations
- **DonationTracker**: Visualizes donation progress
- **ExternalDonationTracker**: Tracks and displays external donation activity
- **DonationHistory**: Shows complete donation history
- **DonationEmailViewer**: Tests and previews email notifications

### Data Flow
1. User interacts with donation forms or charity links
2. Actions are processed through the donation service
3. DonationContext updates global state
4. Components re-render with updated information
5. Data is persisted to localStorage

## 📥 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/last-10-nights-giving.git
cd last-10-nights-giving

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Usage

### Making a Quick Donation
1. Navigate to the Quick Donation tab
2. Select a charity and cause
3. Enter donation amount
4. Complete the donation form
5. Confirm your donation

### Scheduling Donations
1. Go to the Donation Scheduler tab
2. Select which night(s) to donate on
3. Choose charity and amount
4. Set up email reminders (optional)
5. Confirm your scheduled donations

### Tracking External Donations
1. Browse the Charities tab
2. Click on a charity's website link
3. Enter your planned donation amount in the modal
4. Complete your donation on the charity's website
5. The donation will be tracked and added to your history when confirmed

## 🌐 External Donation Tracking

The platform includes a sophisticated system for tracking donations made directly on charity websites:

### How It Works
1. **Tracking ID Generation**: When a user clicks on an external charity link, the system generates a unique tracking ID.
2. **UTM Parameters**: The charity URL is appended with UTM parameters containing the tracking ID.
3. **User Input**: Users can input their planned donation amount before visiting the charity website.
4. **Webhook Simulation**: The system simulates webhook callbacks from charity platforms to confirm donations.
5. **Donation Confirmation**: Confirmed external donations are added to the user's donation history.

### Implementation Details
- `trackExternalDonation()`: Generates tracking IDs and UTM parameters
- `processWebhookCallback()`: Handles confirmation of external donations
- `ExternalDonationTracker`: Displays pending and confirmed external donations
- Local storage is used to maintain pending donation state

## 📅 Donation Scheduling

The scheduling system allows users to plan their donations for specific nights:

### Features
- Schedule donations for any of the last 10 nights
- Set different amounts for each night
- Receive email reminders
- Automatic processing on the scheduled date
- Customizable notification times

### Implementation
- Uses localStorage to persist scheduled donations
- Simulates a backend service for processing scheduled donations
- Provides a visual calendar interface for easy scheduling
- Integrates with EmailJS for sending reminders

## 📧 Email Notification System

The platform includes a comprehensive email notification system to keep users informed about their donations:

### Features
- **Confirmation Emails**: Sent immediately when a donation is scheduled
- **Nightly Reminders**: Automatically sent during each of the last 10 nights of Ramadan
- **Customizable Timing**: Users can select their preferred reminder time
- **Email Testing**: Admin interface to test email templates and delivery

### Implementation Details
- **EmailJS Integration**: Uses EmailJS service for reliable email delivery without a backend
- **Template-Based Emails**: Customized templates for different notification types
- **Scheduled Reminders**: Intelligent scheduling system that sends emails at the right time
- **Email Templates**:
  - Confirmation template: Includes donation details, charity information, and schedule
  - Reminder template: Night-specific reminders with donation amount and charity information

### How It Works
1. When a user schedules a donation, they provide their email address and preferred reminder time
2. The system sends an immediate confirmation email with donation details
3. The reminder service schedules emails for each of the last 10 nights (March 22-31, 2025)
4. At the specified time on each night, users receive a reminder email with that night's donation details
5. Administrators can test both email types through the DonationEmailViewer component



Built with ❤️ to facilitate charitable giving during Ramadan's blessed nights.
