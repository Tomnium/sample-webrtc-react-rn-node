import styled from 'styled-components';

export const ControlButton = styled.i`
    cursor: pointer;
    padding: 5px;
    font-size: 20px;
    color: ${(props) => props.perm && 'white' || 'red'};
`;
