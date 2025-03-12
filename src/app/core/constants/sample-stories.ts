import { Story } from '../models/story.model';

export const SAMPLE_SCIFI_STORY: Story = {
  id: 'cosmic-odyssey',
  title: 'Cosmic Odyssey',
  author: 'Alex Writer',
  coverImage: 'assets/images/cosmic-cover.jpg',
  description: 'An interstellar journey through forgotten galaxies where choices determine humanity\'s fate.',
  genre: 'sci-fi',
  startNodeId: 'start',
  created: new Date('2023-01-15'),
  modified: new Date('2023-01-20'),
  nodes: {
    'start': {
      id: 'start',
      content: "You awake from cryo-sleep, alerts blaring throughout the ship. The navigation system shows you're off course, drifting toward an uncharted star system. The AI assistant is offline, and you're the only crew member awake.",
      choices: [
        { text: 'Try to fix the navigation system', nextNodeId: 'nav-fix' },
        { text: 'Wake up another crew member', nextNodeId: 'wake-crew' },
        { text: 'Investigate the unknown signal coming from nearby', nextNodeId: 'investigate-signal' }
      ],
      metadata: {
        mood: 'tense',
        image: 'assets/images/spaceship-cockpit.jpg'
      }
    },
    'nav-fix': {
      id: 'nav-fix',
      content: "You access the navigation terminal. Diagnostics reveal multiple system failures caused by an energy surge from an external source. The ship's thrusters are functioning, but the guidance system is corrupted. You could attempt a manual override or run the emergency recovery protocol.",
      choices: [
        { text: 'Attempt manual override', nextNodeId: 'manual-override' },
        { text: 'Run emergency recovery protocol', nextNodeId: 'recovery-protocol' }
      ],
      metadata: {
        mood: 'tense'
      }
    },
    'wake-crew': {
      id: 'wake-crew',
      content: "You decide to wake up the engineering specialist, Dr. Chen. The cryo-pod hisses as it opens, and Dr. Chen groggily steps out. 'What's happening? We're not scheduled for arrival for another 6 months,' she says, noticing the alarms.",
      choices: [
        { text: 'Explain the navigation issue', nextNodeId: 'explain-to-chen' },
        { text: 'Ask her to check the ship\'s power core', nextNodeId: 'check-power-core' }
      ],
      metadata: {
        mood: 'mysterious'
      }
    },
    'investigate-signal': {
      id: 'investigate-signal',
      content: "You tune into the strange signal. At first, it seems like random noise, but patterns emerge—it's a repeating mathematical sequence. As you analyze it further, you realize it's a distress call, but unlike any human protocol you've encountered.",
      choices: [
        { text: 'Respond to the signal', nextNodeId: 'respond-signal' },
        { text: 'Ignore it and focus on fixing the ship', nextNodeId: 'nav-fix' },
        { text: 'Track the signal\'s source', nextNodeId: 'track-signal' }
      ],
      metadata: {
        mood: 'mysterious',
        image: 'assets/images/strange-signal.jpg'
      }
    },
    // Add more nodes here...
  }
};

// Export an array of sample stories
export const SAMPLE_STORIES = [SAMPLE_SCIFI_STORY];