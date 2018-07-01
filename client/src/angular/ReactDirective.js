import angular from 'angular';
import React from 'react';
import ReactDOM from 'react-dom';

function ReactDirective(Component, targetId, scp, watch = 'pictureSetId') {
  return (timer) => ({
    template: `<div id="${targetId}{{computerId}}" class="react-directive-root"></div>`,
    scope: scp,
    link: function link(scope) {
      var fn = () => {
        const reactRoot = document.getElementById(`${targetId}${scope.computerId}`);
        scope.$watch(
          watch,
          function(newValue, oldValue) {
            if (angular.isDefined(newValue)) {
              const nextProps = Object.keys(scp).reduce((acc, prop) => {
                if (scope[prop]) {
                  acc[prop] = scope[prop]
                }
                return acc;
              }, {});
              ReactDOM.render(
                <Component
                  {...nextProps}
                  pictureSetId={Array.isArray(newValue) ? newValue[0] : newValue}
                  pictureCollection={Array.isArray(newValue) ? newValue[1] : undefined}
                />,
                reactRoot
              );
            }
          },
          true
        );
      };
      timer(fn, 0);
    },
  });
}

export default ReactDirective;
