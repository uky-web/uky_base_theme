# UK Drupal 8 Base Theme
This is a Drupal 8 base theme for use with University of Kentucky websites. This theme is intended to theme sites built with the [UK Base Installation Profile](https://gitlab.com/uky-web/university-web-platform/drupal-8/uky_base). 

## Getting Started
To get started with this theme and the Installation Profile, check out the [UK Drupal 8 Project Template](https://gitlab.com/uky-web/university-web-platform/drupal-8/drupal-8-project-template). It provides a starter `composer.json` file that includes this theme and the Install Profile, as well as handy tools for local development.

## Dependencies
The theme has 3 direct dependencies:
* The Drupal [Components module](https://www.drupal.org/project/components).
* A custom Drupal module called [UKD8 Customizations](https://gitlab.com/uky-web/university-web-platform/drupal-8/ukd8_customizations).
* The UK [Limestone pattern library](https://gitlab.com/uky-web/university-web-platform/web-design-system/patternlab) (as an NPM module).

### Other Requirements
* Drupal 8
* NPM 
* Not required, but recommended: [UK Base Installation Profile.](https://gitlab.com/uky-web/university-web-platform/drupal-8/uky_base)

## Installation
These requirements are defined in the theme's `composer.json` file. It also includes a post-install command to run `npm install`, which will install the Limestone package.


##Sub-theming
A simple sub-theme boilerplate project is available [here](https://gitlab.com/uky-web/university-web-platform/drupal-8/ukd8-subtheme-boilerplate).
