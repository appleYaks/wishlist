import transitionEndName from 'client/utils/get-transitionend-event-name';

function widthTransitionEnded (event) {
    event.data.$viewEl.removeClass('controls-toggling');
}

var ListControlsControllerMixin = Ember.Mixin.create({
    actions: {
        toggleControls: function (listItemView) {
            var $el = listItemView.$();

            var $controlsToggle = $el.find('.list-controls-toggle');
            var controlsWidth = $controlsToggle.width();

            var $actionableControls = $el.find('.actionable-controls');
            var numControls = $actionableControls.children().length;

            // set width of actionableControls element based on,
            // how many children there are, which could be different for each view
            var width = controlsWidth * numControls + 1;
            $actionableControls.css('width', width);

            // set controls-toggling class to allow any CSS animations to occur,
            // then remove the class once the animation is over
            $el.addClass('controls-toggling');
            $actionableControls.one(transitionEndName, { $viewEl: $el }, widthTransitionEnded);

            var isControlsOpen = $actionableControls.data('controls-open');

            // set margin-left of actionablecontrols to trigger CSS transition
            if (isControlsOpen) {
                $actionableControls.css('margin-left', 0);
                $actionableControls.data('controls-open', false);
            } else {
                $actionableControls.css('margin-left', -1 * controlsWidth * numControls - 1);
                $actionableControls.data('controls-open', true);
            }

        }
    }
});

export default ListControlsControllerMixin;
