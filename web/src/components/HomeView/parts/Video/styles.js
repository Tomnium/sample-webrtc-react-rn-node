import styled from 'styled-components';

export const ControlButton = styled.i`
    cursor: pointer;
    padding: 5;
    font-size: 20;
    color: ${(props) => props.perm && 'white' || 'red'};
`;
