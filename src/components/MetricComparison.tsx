import { styled } from 'stitches.config';
import { Text } from '@/components/stitches';
import { useState, type ComponentProps } from 'react';

export enum MetricColor {
  orange = 'orange',
  cyan = 'cyan',
}

type MetricColorTypes = {
  [key in MetricColor]: {
    normal: ComponentProps<typeof Text>['color']
    dark: ComponentProps<typeof Text>['color']
    label: ComponentProps<typeof Text>['color']
  };
};

const metricColor: MetricColorTypes = {
  orange: {
    normal: 'orange1',
    dark: 'orange3',
    label: 'cyan9'
  },
  cyan: {
    normal: 'cyan1',
    dark: 'cyan6',
    label: 'cyan9'
  }
};

interface Metric {
  value: string | number
  label: string
}

interface Props {
  firstMetric: Metric
  secondMetric: Metric
  color: MetricColor
}

const MetricComparison = ({ firstMetric, secondMetric, color }: Props) => {
  const [secondMetricHover, setSecondMetricHover] = useState<boolean>(false);

  return (
    <Wrapper>
      <InlineElement>
        <NumberColumn>
          <Text size="13" color={secondMetricHover ? metricColor[color].dark : metricColor[color].normal} font="chakraPetch">{firstMetric.value}</Text>
          <Text size="8" color={metricColor[color].label} font="chakraPetch">{firstMetric.label}</Text>
        </NumberColumn>
      </InlineElement>

      <InlineElement css={{ width: 5 }} />
      <Text size="13" color={metricColor[color].normal} font="chakraPetch">/</Text>
      <InlineElement css={{ width: 5 }} />
      <InlineElement>

        <NumberColumn onMouseEnter={() => setSecondMetricHover(true)} onMouseLeave={() => setSecondMetricHover(false)} >
          <Text size="13" color={secondMetricHover ? metricColor[color].normal : metricColor[color].dark} font="chakraPetch">{secondMetric.value}</Text>
          <Text size="8" color={metricColor[color].label} font="chakraPetch">{secondMetric.label}</Text>
        </NumberColumn>
      </InlineElement>
    </Wrapper>
  );
};

MetricComparison.defaultProps = {

} as Partial<Props>;

const Wrapper = styled('div', {
  display: 'flex',
  // justifyContent: 'center',
  alignItems: 'flex-start '
});

const NumberColumn = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
});

const InlineElement = styled('div', {
  display: 'inline-block',
});

export default MetricComparison;
