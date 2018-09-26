import React from 'react';
import { shallow } from 'enzyme';
import { SetupNew } from './';

import SignInForm from '../../components/SignInForm';

describe('Setup', () => {
  const defaultProps = {
    data: {},
    client: {},
  };

  it('renders successfully', () => {
    const component = shallow(<SetupNew {...defaultProps} />);
    expect(component.length).toBe(1);
  });

  describe('when apollo data does not contain github auth token', () => {
    let component;
    const clientMock = {
      writeData: jest.fn(),
    };
    const data = {
      githubAuth: {
        token: null,
      },
    };

    beforeAll(() => {
      component = shallow(<SetupNew data={data} client={clientMock} />);
    });

    afterEach(() => {
      clientMock.writeData.mockClear();
    });

    it('renders a <SignInForm/>', async () => {
      expect(component.find(SignInForm).length).toBe(1);
    });

    describe('saveGithubToken fn passed to <SignInForm/> as a prop', () => {
      it('writes github token to apollo client and sets loading to false', () => {
        const token = '1234';
        const saveGithubToken = component.find(SignInForm).props()
          .saveGithubToken;

        expect(clientMock.writeData).not.toBeCalled;
        saveGithubToken(token);
        expect(clientMock.writeData).toHaveBeenLastCalledWith({
          data: {
            githubAuth: {
              token,
              loadingToken: false,
              __typename: 'GithubAuth',
            },
          },
        });
      });

      describe('setLoadingToken fn passed to <SignInForm/> as a prop', () => {
        it('sets token loading state to true', () => {
          const setLoadingToken = component.find(SignInForm).props()
            .setLoadingToken;

          expect(clientMock.writeData).not.toBeCalled;
          setLoadingToken();
          expect(clientMock.writeData).toHaveBeenLastCalledWith({
            data: {
              githubAuth: {
                loadingToken: true,
                __typename: 'GithubAuth',
              },
            },
          });
        });
      });
    });
  });
});
