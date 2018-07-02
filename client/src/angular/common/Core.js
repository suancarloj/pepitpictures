import angular from 'angular';
import ConfigProvider from './ConfigProvider';

export default angular
  .module('Core', [])
  .constant('Config', ConfigProvider)
  .name;

