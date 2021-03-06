import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import LoadingMessage from '../../components/LoadingMessage';
import { Home } from '.';
import FullView from './components/FullView';
import MinimalView from './components/MinimalView';
import { homePageViews } from '../../constants';

describe('Home', () => {
  const baseProps = {
    data: [
      {
        id: '1',
        name: 'repo1',
        url: 'url',
        owner: {
          login: 'login',
          avatarUrl: 'avatar',
        },
      },
      {
        id: '2',
        name: 'repo2',
        url: 'url',
        owner: {
          login: 'login',
          avatarUrl: 'avatar',
        },
      },
    ],
    loading: false,
    error: null,
    numberOfSelectedRepos: 2,
    settings: {
      userSettings: {
        id: 'UserSettings',
        currentView: homePageViews.FULL_VIEW,
      },
    },
    currentUser: 'user',
  };

  it('renders successfully', () => {
    const component = shallow(<Home {...baseProps} />);
    expect(component.length).toBe(1);
  });

  describe('view display', () => {
    describe('when full view is selected', () => {
      let component;

      beforeAll(() => {
        component = shallow(
          <Home
            {...baseProps}
            settings={{
              userSettings: {
                id: 'UserSettings',
                currentView: homePageViews.FULL_VIEW,
              },
            }}
          />,
        );
      });

      it('renders the full view', () => {
        expect(component.find(FullView).length).toBe(1);
      });

      it('does not render the minimal view', () => {
        expect(component.find(MinimalView).length).toBe(0);
      });
    });

    describe('when minimal view is selected', () => {
      let component;

      beforeAll(() => {
        component = shallow(
          <Home
            {...baseProps}
            settings={{
              userSettings: {
                id: 'UserSettings',
                currentView: homePageViews.MINIMAL_VIEW,
              },
            }}
          />,
        );
      });

      it('renders the minimal view', () => {
        expect(component.find(MinimalView).length).toBe(1);
      });

      it('does not render the full view', () => {
        expect(component.find(FullView).length).toBe(0);
      });
    });
  });

  describe('when loading repositories', () => {
    it('renders a loading message', () => {
      const component = shallow(<Home {...baseProps} loading />);
      expect(component.find(LoadingMessage).length).toBe(1);
    });
  });

  describe('when not loading repositories', () => {
    it('does not render a loading message', () => {
      const component = shallow(<Home {...baseProps} />);
      expect(component.find(LoadingMessage).length).toBe(0);
    });
  });

  describe('when there is an error', () => {
    it('shows a warning message', () => {
      const component = shallow(
        <Home {...baseProps} error={{ message: 'err' }} />,
      );
      expect(component.find('.updateWarning').length).toBe(1);
    });
  });

  describe('when there is not an error', () => {
    it('does not show a warning message', () => {
      const component = shallow(<Home {...baseProps} />);
      expect(component.find('.updateWarning').length).toBe(0);
    });
  });

  describe('when the user has not selected any repos to monitor', () => {
    const component = shallow(
      <Home {...baseProps} numberOfSelectedRepos={0} />,
    );
    it('shows an informational message', () => {
      expect(component.find('.noReposMessage').length).toBe(1);
    });

    it('renders a link to /app/selectRepos', () => {
      expect(component.find(Link).props().to).toBe('/app/selectRepos');
    });
  });

  describe('when the user has selected repos to monitor', () => {
    const component = shallow(<Home {...baseProps} />);
    it('does not show an informational message', () => {
      expect(component.find('.noReposMessage').length).toBe(0);
    });

    it('does not render a link to /app/selectRepos', () => {
      expect(component.find(Link).length).toBe(0);
    });
  });

  describe('toggleOpenRepo()', () => {
    describe('when repo is not already open', () => {
      it('saves repo id as the currently open repo', () => {
        const componentInstance = shallow(<Home {...baseProps} />).instance();
        const repoId = '1';
        componentInstance.toggleOpenRepo(repoId);
        expect(componentInstance.state.openRepoId).toBe(repoId);
      });
    });

    describe('when repo is already open', () => {
      it('saves repo id as the currently open repo', () => {
        const componentInstance = shallow(<Home {...baseProps} />).instance();

        const repoId = '1';
        componentInstance.setState({ openRepoId: repoId });
        componentInstance.toggleOpenRepo(repoId);
        expect(componentInstance.state.openRepoId).toBeNull();
      });
    });
  });
});
