import ReactGA from 'react-ga4';
import { UaEventOptions } from 'react-ga4/types/ga4';

export const gaPageView = ({ page, title }: { page: string; title: string }) => {
  ReactGA.send({
    hitType: 'pageview',
    page,
    title,
  });
};

export const gaEventTrigger = (eventOptions: UaEventOptions) => {
  ReactGA.event(eventOptions);
};
