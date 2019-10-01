import { IUser } from 'modules/auth/types';
import Icon from 'modules/common/components/Icon';
import React from 'react';
import RTG from 'react-transition-group';
import FeatureDetail from '../containers/FeatureDetail';
import { IFeature } from '../types';
import ModulItem from './ModulItem';
import { Content, Greeting, NavButton } from './styles';
import Suggestion from './Suggestion';

type Props = {
  availableFeatures: IFeature[];
  currentStep?: string;
  changeStep: (step: string) => void;
  forceComplete: () => void;
  currentUser: IUser;
};

class Onboarding extends React.Component<
  Props,
  { selectedFeature?: IFeature }
> {
  constructor(props) {
    super(props);

    this.state = { selectedFeature: undefined };
  }

  renderFeature(feature: IFeature) {
    const { changeStep } = this.props;
    const { text, isComplete, description, icon, color } = feature;

    const onClick = () => {
      this.setState({ selectedFeature: feature }, () => {
        changeStep('featureDetail');
      });
    };

    return (
      <ModulItem
        title={text}
        description={description}
        icon={icon}
        color={color}
        key={feature.name}
        vertical={true}
        onClick={onClick}
        isComplete={isComplete}
      />
    );
  }

  getCurrentUserName = () => {
    const { currentUser } = this.props;

    if (!currentUser.details) {
      return 'Dear';
    }

    return currentUser.details.shortName || currentUser.details.fullName || '';
  };

  renderContent() {
    const { selectedFeature } = this.state;
    const {
      availableFeatures,
      currentStep,
      changeStep,
      forceComplete
    } = this.props;

    const commonProps = {
      forceComplete,
      currentUserName: this.getCurrentUserName()
    };

    if (currentStep === 'initial') {
      const onClick = () => {
        changeStep('featureList');
      };

      return (
        <Suggestion {...commonProps} buttonText="Start" onClick={onClick} />
      );
    }

    if (currentStep === 'inComplete') {
      const onClick = () => {
        changeStep('featureList');
      };

      return (
        <Suggestion {...commonProps} buttonText="Resume" onClick={onClick} />
      );
    }

    if (currentStep === 'featureDetail') {
      const onBack = () => {
        this.setState({ selectedFeature: undefined }, () => {
          changeStep('featureList');
        });
      };

      return (
        <>
          <NavButton onClick={onBack}>
            <Icon icon="arrow-left" size={24} />
          </NavButton>
          {selectedFeature && <FeatureDetail feature={selectedFeature} />}
        </>
      );
    }

    if (currentStep === 'featureList') {
      return (
        <>
          <Greeting>
            Good morning!{' '}
            <b>
              {this.getCurrentUserName()}
              <span role="img" aria-label="Wave">
                👋
              </span>
            </b>
            <br /> What module do you use usually?
          </Greeting>
          {availableFeatures.map(availabeFeature =>
            this.renderFeature(availabeFeature)
          )}
        </>
      );
    }

    return null;
  }

  onHide = () => {
    this.props.changeStep('');
  };

  render() {
    const { currentStep } = this.props;

    if (!currentStep) {
      return null;
    }

    return (
      <RTG.CSSTransition
        in={true}
        appear={true}
        timeout={500}
        classNames="slide-in-small"
        unmountOnExit={true}
      >
        <Content>
          <NavButton onClick={this.onHide} right={true}>
            <Icon icon="times" size={17} />
          </NavButton>
          {this.renderContent()}
        </Content>
      </RTG.CSSTransition>
    );
  }
}

export default Onboarding;