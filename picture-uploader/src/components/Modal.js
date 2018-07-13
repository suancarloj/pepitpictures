import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal-root');

const ModalOverlay = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
`;

const ModalContent = styled.div`
  background-color: #fff;
  height: 100%;
  padding: 10px;
  position: relative;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  p {
    color: #000;
    font-size: 14px;
    font-weight: 300;
  }
`;

const Close = styled.button`
  border-style: none;
  position: absolute;
  right: 10px;
  top: 10px;
`;

// Let's create a Modal component that is an abstraction around
// the portal API.
class ModalContainer extends Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
  }

  render() {
    if (this.props.isHidden) {
      return null;
    }
    // Use a portal to render the children into the element
    return createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el
    );
  }
}

ModalContainer.propTypes = {
  children: PropTypes.node,
  isHidden: PropTypes.bool,
};

function Modal({ children, onClickOutside, style = {}, isHidden = false }) {
  return (
    <ModalContainer isHidden={isHidden}>
      <ModalOverlay onClick={onClickOutside}>
        <ModalContent onClick={(e) => e.stopPropagation()} style={style}>
          <Close onClick={onClickOutside}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 6 6">
              <path
                fill="rgb(30, 179, 188)"
                d="M3 2.246L.926.172a.533.533 0 1 0-.754.754L2.246 3 .172 5.074a.533.533 0 1 0 .754.754L3 3.754l2.074 2.074a.533.533 0 1 0 .754-.754L3.754 3 5.828.926a.533.533 0 1 0-.754-.754L3 2.246z"
              />
            </svg>
          </Close>

          {children}
        </ModalContent>
      </ModalOverlay>
    </ModalContainer>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  isHidden: PropTypes.bool,
  onClickOutside: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default Modal;
