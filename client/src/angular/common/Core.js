import angular from 'angular';
import ConfigProvider from './ConfigProvider';
import FooterDirective from './FooterDirective';
import NavbarDirective from './NavbarDirective';

export default angular
  .module('Core', [])
  .constant('Config', ConfigProvider)
  .directive('ppFooter', FooterDirective)
  .directive('ppNavbar', NavbarDirective)
  .name;

