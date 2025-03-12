export default { title: 'Alert' };

import alert_template from './alert.twig';
export const alert = args => alert_template({
  ...args,
});
alert.args = {
  title: 'Test alert',
  message: '<p>Lorem ipsum dolor sit amet non eu labore at nisi leo tempor velit.</p>',
  alert_level: 'warning',
};
alert.argTypes = {
  alert_level: {
    options: ['announcement', 'warning', 'danger'],
    control: { type: 'radio' },
  }
};

import in_page_template from './in-page.twig';
export const in_page_alert = args => in_page_template({
  ...args,
});
in_page_alert.args = {
  title: 'Test alert',
  message: '<p>Lorem ipsum dolor sit amet non eu labore at nisi leo tempor velit.</p>',
};
