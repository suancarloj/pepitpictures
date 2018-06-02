import angular from 'angular';
import React from 'react';
import ReactDOM from 'react-dom';

function ReactDirective(Component, targetId, scp) {
  return (timer) => ({
    template: `<div id="${targetId}-{{computerId}}"></div>`,
    scope: scp,
    link: function link(scope) {
      var fn = () => {
        const reactRoot = document.getElementById(`${targetId}-${scope.computerId}`);
        scope.$watch(
          'pictureSetId',
          function(newValue, oldValue) {
            if (angular.isDefined(newValue)) {
              ReactDOM.render(
                <Component computerId={scope.computerId} pictureSetId={newValue} />,
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
