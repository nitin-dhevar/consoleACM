/* Copyright Contributors to the Open Cluster Management project */

import { act, render } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { configMapsState } from '../../../../../atoms'
import { clickByText, waitForText } from '../../../../../lib/test-util'
import { ConfigMap, PolicyReport } from '../../../../../resources'
import { ClusterPolicySidebar } from './ClusterPolicySidebar'
import { MemoryRouter } from 'react-router-dom'

const mockPolicyReports: PolicyReport = {
  apiVersion: 'wgpolicyk8s.io/v1alpha2',
  kind: 'PolicyReport',
  metadata: {
    name: 'test-cluster',
    namespace: 'test-cluster',
    uid: 'uid.report.risk.1',
  },
  results: [
    {
      category: 'category,category1,category2',
      scored: false,
      source: 'insights',
      properties: {
        created_at: '2021-03-02T21:26:04Z',
        total_risk: '1',
        component: 'rule.id.1',
      },
      message: 'policyreport testing risk 1',
      policy: 'policyreport testing risk 1 policy',
      result: 'policyreport testing risk 1 result',
    },
    {
      category: 'category,category1,category2',
      scored: false,
      source: 'insights',
      properties: {
        created_at: '2021-03-02T21:26:04Z',
        total_risk: '2',
        component: 'rule.id.2',
      },
      message: 'policyreport testing risk 2',
      policy: 'policyreport testing risk 2 policy',
      result: 'policyreport testing risk 2 result',
    },
    {
      category: 'category,category1,category2',
      scored: false,
      source: 'insights',
      properties: {
        created_at: '2021-04-02T21:26:04Z',
        total_risk: '3',
        component: 'rule.id.3',
      },
      message: 'policyreport testing risk 3',
      policy: 'policyreport testing risk 3 policy',
      result: 'policyreport testing risk 3 result',
    },
    {
      category: 'category,category1,category2',
      scored: false,
      source: 'insights',
      properties: {
        created_at: '2021-03-02T21:26:04Z',
        total_risk: '4',
        component: 'rule.id.4',
      },
      message: 'policyreport testing risk 4',
      policy: 'policyreport testing risk 4 policy',
      result: 'policyreport testing risk 4 result',
    },
    {
      category: 'category,category1,category2',
      scored: false,
      source: 'grc',
      properties: {
        created_at: '2021-03-02T21:26:04Z',
        total_risk: '4',
        component: 'rule.id.4',
      },
      message: 'policyreport testing risk 4',
      policy: 'policyreport testing risk 4 policy',
      result: 'policyreport testing risk 4 result',
    },
  ],
}

const mockConfigmap: ConfigMap[] = [
  {
    kind: 'ConfigMap',
    apiVersion: 'v1',
    metadata: {
      name: 'insight-content-data',
      namespace: 'open-cluster-management',
    },
    data: {
      'policyreport testing risk 1 policy': '{"reason":"testing-reason","resolution":"testing-resolution"}',
      'policyreport testing risk 2 policy': '{"reason":"testing-reason","resolution":"testing-resolution"}',
      'policyreport testing risk 3 policy': '{"reason":"testing-reason","resolution":"testing-resolution"}',
      'policyreport testing risk 4 policy': '{"reason":"testing-reason","resolution":"testing-resolution"}',
    },
  },
]

describe('ClusterPolicySidebar', () => {
  const Component = () => (
    <RecoilRoot initializeState={(snapshot) => snapshot.set(configMapsState, mockConfigmap)}>
      <MemoryRouter>
        <ClusterPolicySidebar data={mockPolicyReports} />
      </MemoryRouter>
    </RecoilRoot>
  )
  test('renders', async () => {
    render(<Component />)
    await act(async () => {
      // Check the sidebar has loaded with static text
      await waitForText(
        'Identified issues from your cluster in different categories. We Identify and prioritize risks and issues to security, configuration, health, performance, availability, and stability of your clusters.'
      )

      // wait for policy reports to be displayed and click the first report in table
      await waitForText('policyreport testing risk 1 policy: policyreport testing risk 1')
      await clickByText('policyreport testing risk 1 policy: policyreport testing risk 1')

      // wait for drilldown risk subdetail component
      await waitForText('Low')

      // wait for resolution
      await waitForText('testing-resolution')

      // wait for reason
      await clickByText('Reason')
      await waitForText('testing-reason')

      // Click back button and wait for static text
      await clickByText('Back')
      await waitForText(
        'Identified issues from your cluster in different categories. We Identify and prioritize risks and issues to security, configuration, health, performance, availability, and stability of your clusters.'
      )

      // wait for policy reports to be displayed and click the moderate recomendation
      await waitForText('policyreport testing risk 2 policy: policyreport testing risk 2')
      await clickByText('policyreport testing risk 2 policy: policyreport testing risk 2')
      // wait for drilldown risk subdetail component
      await waitForText('Moderate')
      // Click back button and wait for static text
      await clickByText('Back')

      // wait for policy reports to be displayed and click the important recomendation
      await waitForText('policyreport testing risk 3 policy: policyreport testing risk 3')
      await clickByText('policyreport testing risk 3 policy: policyreport testing risk 3')
      // wait for drilldown risk subdetail component
      await waitForText('Important')
      // Click back button and wait for static text
      await clickByText('Back')

      // wait for policy reports to be displayed and click the critical recomendation
      await waitForText('policyreport testing risk 4 policy: policyreport testing risk 4')
      await clickByText('policyreport testing risk 4 policy: policyreport testing risk 4')
      // wait for drilldown risk subdetail component
      await waitForText('Critical')
      // Click back button and wait for static text
      await clickByText('Back')
    })
  })
})
