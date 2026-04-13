# 🤖 Grok AI Prompts: Engineering & Optimization Guide

## ✅ Updated setup notes (after cleanup)

- Secrets were removed from code. Use `backend/.env` (see `backend/.env.example`).
- The Grok client now uses **async HTTP** (`httpx.AsyncClient`) and is closed on app shutdown.
- Prompt inputs are now passed as **JSON payload** and treated as untrusted data to reduce prompt-injection risk.

## 📋 Current Prompt Analysis

### Lead Analysis Prompt Structure

Our current prompt in `grok_client.py` follows a structured approach:

```python
def _create_lead_analysis_prompt(self, lead_data: Dict[str, Any]) -> str:
    prompt = f"""
Analyze the following sales lead and provide a comprehensive assessment:

LEAD INFORMATION:
- Name: {name}
- Company: {company}
- Title: {title}
- Industry: {industry}
- Company Size: {company_size}
- Budget Range: {budget_range}
- Lead Source: {lead_source}
- Notes: {notes}

Please provide your analysis in the following JSON format:
{{
    "overall_score": <number between 0-100>,
    "qualification_status": "<Qualified|Not Qualified|Needs More Info>",
    "priority_level": "<High|Medium|Low>",
    "scoring_breakdown": {{
        "title_score": <0-100>,
        "company_score": <0-100>,
        "industry_fit": <0-100>,
        "budget_alignment": <0-100>
    }},
    "key_insights": [...],
    "recommended_approach": "<strategy>",
    "next_steps": [...],
    "risk_factors": [...]
}}
"""
```

## 🎯 Current Strengths

1. **Structured Output**: JSON format ensures consistent parsing
2. **Multi-dimensional Scoring**: Breaks down score into categories
3. **Actionable Insights**: Provides next steps and recommendations
4. **Risk Assessment**: Identifies potential concerns
5. **Clear Instructions**: Specific scoring criteria and ranges

## ⚠️ Areas for Improvement

1. **Generic Scoring Criteria**: Lacks industry-specific considerations
2. **No Product Context**: Grok doesn't know what you're selling
3. **Missing Competitive Intelligence**: No competitor analysis
4. **Static Weighting**: All factors weighted equally
5. **No Historical Data**: Doesn't learn from past successful/failed leads
6. **Limited Personalization**: Same prompt for all industries

## 🚀 Enhanced Prompt Strategies

### 1. Product-Aware Context

```python
PRODUCT_CONTEXT = """
PRODUCT: Grok SDR - AI-powered sales automation platform

CAPABILITIES:
- Automatic lead scoring and qualification (0-100 scale)
- AI-generated personalized outreach messages
- Sales pipeline automation and management
- CRM integration and workflow optimization
- Real-time lead analytics and insights

TARGET CUSTOMERS:
- B2B companies with 50+ employees
- Sales teams (5+ reps) looking to scale outreach
- Growing companies needing lead qualification
- Sales managers wanting better pipeline visibility

IDEAL CUSTOMER PROFILE:
- Company Size: 50-5000 employees (sweet spot: 200-1000)
- Budget Range: $25K-$500K annually
- Decision Makers: VP Sales, Sales Directors, CRO, CMO, CTOs
- Pain Points: Manual lead qualification, low conversion rates, inefficient outreach

VALUE PROPOSITION:
- 10x faster lead qualification
- 3x higher email response rates
- 300% ROI within 6 months
- 50% reduction in manual sales tasks
"""
```

### 2. Industry-Specific Analysis

```python
INDUSTRY_CONTEXTS = {
    'technology': {
        'decision_makers': ['CTO', 'VP Engineering', 'Sales Directors', 'Technical Directors'],
        'budget_cycles': 'Fiscal year alignment, Q4 budget flush common',
        'pain_points': ['Scaling challenges', 'Technical debt', 'Competitive pressure', 'Developer productivity'],
        'evaluation_process': 'Technical evaluation, POCs, stakeholder buy-in required',
        'timeline': '2-6 months from initial interest to close',
        'red_flags': ['Overly technical focus without business impact', 'No budget authority'],
        'success_indicators': ['Current tool limitations mentioned', 'Growth stage company', 'Technical debt pain']
    },
    'healthcare': {
        'decision_makers': ['CMO', 'CTO', 'Practice Managers', 'Department Heads', 'Compliance Officers'],
        'budget_cycles': 'Annual, often tied to reimbursement changes',
        'pain_points': ['Regulatory compliance', 'Patient outcomes', 'Operational efficiency', 'Data security'],
        'evaluation_process': 'Compliance review, security assessment, ROI analysis, committee approval',
        'timeline': '6-18 months due to regulatory considerations',
        'red_flags': ['Non-compliance with HIPAA', 'No security requirements mentioned'],
        'success_indicators': ['Compliance pain points', 'Efficiency focus', 'Patient outcome improvement']
    },
    'finance': {
        'decision_makers': ['CRO', 'VP Sales', 'Compliance Officers', 'Risk Managers'],
        'budget_cycles': 'Quarterly reviews, annual planning, regulatory driven',
        'pain_points': ['Regulatory compliance', 'Risk management', 'Client acquisition costs', 'Audit requirements'],
        'evaluation_process': 'Risk assessment, compliance review, ROI analysis, audit approval',
        'timeline': '3-12 months depending on regulatory requirements',
        'red_flags': ['No compliance consideration', 'High-risk tolerance'],
        'success_indicators': ['Regulatory pressure', 'Cost efficiency focus', 'Risk reduction needs']
    }
}
```

### 3. Competitive Intelligence Framework

```python
COMPETITIVE_ANALYSIS = {
    'direct_competitors': [
        'salesforce', 'hubspot', 'pipedrive', 'outreach', 'salesloft',
        'apollo', 'zoominfo', 'linkedin sales navigator'
    ],
    'competitor_indicators': {
        'research_intent': ['comparing solutions', 'evaluation', 'RFP', 'vendor assessment'],
        'dissatisfaction_signals': ['current tool limitations', 'switching from', 'unhappy with'],
        'timing_indicators': ['contract renewal', 'budget approved', 'urgent need']
    },
    'switching_barriers': {
        'high': ['Salesforce enterprise', 'Custom integrations', 'Long-term contracts'],
        'medium': ['HubSpot professional', 'Team training investment'],
        'low': ['Basic CRM', 'Spreadsheets', 'Manual processes']
    }
}
```

### 4. Multi-Stage Analysis Framework

```python
class EnhancedGrokAnalysis:
    """Multi-stage analysis for better accuracy"""

    @staticmethod
    async def stage_1_basic_qualification(lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Quick qualification filter"""
        prompt = f"""
STAGE 1: RAPID QUALIFICATION FILTER

Assess ONLY these critical factors:
1. AUTHORITY: Does "{lead_data.get('title', '')}" indicate buying/influencing power?
2. FIT: Is "{lead_data.get('company_size', '')}" in our target range (50+ employees)?
3. BUDGET: Is "{lead_data.get('budget_range', '')}" realistic for their company size?
4. RED FLAGS: Any obvious disqualifiers?

Lead: {lead_data.get('first_name', '')} {lead_data.get('last_name', '')}
Company: {lead_data.get('company', '')}
Industry: {lead_data.get('industry', '')}

Return ONLY:
{{
    "result": "PASS|FAIL|MAYBE",
    "reasoning": "Brief explanation",
    "confidence": "High|Medium|Low",
    "proceed_to_stage_2": true/false
}}
"""
        return await grok_client.analyze(prompt)

    @staticmethod
    async def stage_2_detailed_analysis(lead_data: Dict[str, Any], stage1_result: Dict[str, Any]) -> Dict[str, Any]:
        """Comprehensive analysis for qualified leads"""

        industry_context = INDUSTRY_CONTEXTS.get(lead_data.get('industry', '').lower(), {})

        prompt = f"""
STAGE 2: COMPREHENSIVE LEAD ANALYSIS

STAGE 1 RESULT: {stage1_result}

{PRODUCT_CONTEXT}

INDUSTRY CONTEXT ({lead_data.get('industry', 'Unknown').upper()}):
{industry_context}

COMPETITIVE LANDSCAPE:
{COMPETITIVE_ANALYSIS}

LEAD PROFILE:
{self._format_detailed_lead_data(lead_data)}

ANALYSIS FRAMEWORK:
1. AUTHORITY ANALYSIS (30% weight)
   - Decision-making power assessment
   - Influence on buying process
   - Likely involvement in vendor selection

2. COMPANY FIT ANALYSIS (25% weight)
   - Size alignment with target market
   - Industry fit for our solution
   - Growth stage and tech adoption likelihood

3. BUDGET REALITY CHECK (25% weight)
   - Budget range vs company size validation
   - Economic factors affecting budget
   - Urgency and timeline considerations

4. INTENT & TIMING ANALYSIS (20% weight)
   - Lead source quality and intent level
   - Urgency indicators from notes/behavior
   - Competitive evaluation stage

Provide detailed analysis focusing on actionable insights and specific recommendations.
"""
        return await grok_client.analyze(prompt)
```

## 📊 Advanced Techniques

### 1. Few-Shot Learning Examples

```python
FEW_SHOT_EXAMPLES = """
SCORING EXAMPLES:

HIGH SCORE (88/100):
Lead: Sarah Chen, VP Sales at TechCorp (500 employees, Series B)
Analysis: VP-level authority, perfect company size, technology industry fit, $100K budget, "urgent need" in notes
Result: Qualified, High Priority
Reasoning: Strong authority + company fit + urgency + realistic budget

MEDIUM SCORE (64/100):
Lead: Mike Johnson, Sales Manager at MidSize Co (100 employees)
Analysis: Manager-level authority, smaller company, exploring options, $25K budget
Result: Needs More Info, Medium Priority
Reasoning: Some authority + decent fit + exploratory stage

LOW SCORE (18/100):
Lead: Student Research, Graduate Student at State University
Analysis: No buying authority, academic institution, research purpose, no real budget
Result: Not Qualified, Low Priority
Reasoning: No authority + no budget + wrong market segment

Now analyze the current lead using similar reasoning patterns...
"""
```

### 2. Chain-of-Thought Reasoning

```python
CHAIN_OF_THOUGHT_TEMPLATE = """
Think through this analysis step by step:

STEP 1: AUTHORITY ASSESSMENT
Title: "{title}"
- What level of authority does this title typically have?
- Do they control or influence budget decisions?
- Are they likely involved in vendor selection?
→ Authority Score: __/100

STEP 2: COMPANY ANALYSIS
Company: "{company}" (Size: {company_size})
- Does company size match our target market (50+ employees)?
- Is this a growing company likely to invest in sales tools?
- What's their likely tech adoption maturity?
→ Company Fit Score: __/100

STEP 3: BUDGET VALIDATION
Budget Range: "{budget_range}"
- Is this realistic for a company of this size?
- Does it align with our typical deal sizes ($25K-$500K)?
- Are there economic factors affecting budget availability?
→ Budget Alignment Score: __/100

STEP 4: INTENT & TIMING
Lead Source: "{lead_source}"
Notes: "{notes}"
- What does the lead source tell us about intent level?
- Do notes indicate active evaluation or just browsing?
- Any urgency or timeline indicators?
→ Intent Score: __/100

STEP 5: COMPETITIVE CONTEXT
- Are they likely using competitor solutions?
- What would switching costs and barriers be?
- How do we differentiate for this profile?

STEP 6: FINAL SYNTHESIS
Combine all factors considering industry context and provide:
- Overall weighted score
- Qualification status and reasoning
- Specific action recommendations
- Risk factors and mitigation strategies
"""
```

### 3. Dynamic Template Selection

```python
class AdaptivePromptEngine:
    """Selects optimal prompt based on lead characteristics"""

    @staticmethod
    def select_prompt_strategy(lead_data: Dict[str, Any]) -> str:
        """Choose the best prompt approach"""

        data_quality = AdaptivePromptEngine._assess_data_completeness(lead_data)
        lead_complexity = AdaptivePromptEngine._assess_lead_complexity(lead_data)

        if data_quality < 0.4:
            return "minimal_data_prompt"
        elif lead_complexity == "enterprise":
            return "enterprise_analysis_prompt"
        elif AdaptivePromptEngine._is_competitive_lead(lead_data):
            return "competitive_intelligence_prompt"
        elif data_quality > 0.8 and lead_complexity == "complex":
            return "comprehensive_analysis_prompt"
        else:
            return "standard_analysis_prompt"

    @staticmethod
    def _assess_data_completeness(lead_data: Dict[str, Any]) -> float:
        """Score data completeness 0.0-1.0"""
        required_fields = ['first_name', 'last_name', 'email', 'company', 'title']
        valuable_fields = ['industry', 'company_size', 'budget_range', 'notes', 'lead_source']

        required_score = sum(1 for field in required_fields if lead_data.get(field))
        valuable_score = sum(1 for field in valuable_fields if lead_data.get(field))

        return (required_score * 0.7 + valuable_score * 0.3) / (len(required_fields) * 0.7 + len(valuable_fields) * 0.3)
```

## 🔧 Implementation Strategy

### Phase 1: Immediate Improvements (This Week)

1. **Add Product Context** - Biggest impact, easy to implement
2. **Industry-Specific Scoring** - Better accuracy for different sectors
3. **Red Flag Detection** - Catch suspicious or competitor leads
4. **Budget Reality Checks** - Cross-reference company size with stated budget

### Phase 2: Advanced Features (Next 2 Weeks)

1. **Multi-Stage Analysis** - Basic qualification → Deep analysis
2. **A/B Testing Framework** - Test prompt versions for accuracy
3. **Context-Aware Scoring** - Market conditions, seasonal factors
4. **Historical Performance Integration** - Learn from past conversions

### Phase 3: Intelligence Layer (Month 1)

1. **Adaptive Prompt Selection** - Choose best prompt per lead type
2. **Continuous Learning** - Improve based on conversion outcomes
3. **Predictive Modeling** - Advanced lead scoring algorithms
4. **Advanced Personalization** - Highly targeted messaging strategies

## 📊 Prompt Performance Metrics

### Key Performance Indicators

```python
PROMPT_METRICS = {
    'accuracy': 'How often scores align with actual conversion outcomes',
    'consistency': 'Score variance for similar lead profiles',
    'specificity': 'Percentage of actionable vs generic insights',
    'cost_efficiency': 'API cost per lead analysis',
    'response_time': 'Average time to generate analysis',
    'completeness': 'Percentage of required fields populated in response'
}
```

### Monitoring Framework

```python
class PromptPerformanceMonitor:
    """Track and optimize prompt performance"""

    @staticmethod
    def log_analysis_result(lead_id: int, prompt_version: str, analysis: Dict[str, Any],
                          execution_time: float, token_count: int):
        """Log each analysis for performance tracking"""

        metrics = {
            'timestamp': datetime.now(),
            'lead_id': lead_id,
            'prompt_version': prompt_version,
            'score_assigned': analysis.get('overall_score'),
            'qualification_status': analysis.get('qualification_status'),
            'execution_time_seconds': execution_time,
            'token_count': token_count,
            'cost_estimate': token_count * 0.0001,
            'insights_count': len(analysis.get('key_insights', [])),
            'specificity_score': PromptPerformanceMonitor._calculate_specificity(analysis)
        }

        logger.info(f"Prompt performance: {metrics}")
        return metrics
```

## 🧪 Testing & Validation

### Automated Prompt Testing

```python
TEST_CASES = [
    {
        'name': 'enterprise_cto_high_score',
        'lead_data': {
            'first_name': 'Alexandra', 'last_name': 'Rodriguez',
            'title': 'Chief Technology Officer',
            'company': 'TechGiant Corp', 'company_size': '1000+',
            'industry': 'Technology', 'budget_range': '$100,000+',
            'notes': 'Actively looking for AI-powered sales automation'
        },
        'expected_score_range': (80, 100),
        'expected_status': 'Qualified',
        'expected_priority': 'High'
    },
    {
        'name': 'student_low_score',
        'lead_data': {
            'first_name': 'Student', 'last_name': 'Researcher',
            'title': 'Graduate Student', 'company': 'State University',
            'industry': 'Education', 'budget_range': 'Under $5,000',
            'notes': 'Doing research on CRM systems for thesis'
        },
        'expected_score_range': (0, 30),
        'expected_status': 'Not Qualified',
        'expected_priority': 'Low'
    },
    {
        'name': 'competitor_intelligence',
        'lead_data': {
            'first_name': 'Jane', 'last_name': 'Competitor',
            'company': 'Direct Competitor Inc', 'title': 'Product Manager',
            'industry': 'Technology', 'budget_range': '$25,000-$50,000',
            'notes': 'Possibly doing competitive research'
        },
        'expected_red_flags': ['Competitive intelligence'],
        'expected_approach': 'Cautious engagement'
    }
]
```

## 🎯 Optimization Recommendations

### Immediate Actions (High Impact, Low Effort)

1. **Add Product Context** to existing prompt
2. **Implement competitor detection** logic
3. **Add budget-size validation** rules
4. **Create industry-specific scoring** weights

### Medium-Term Improvements

1. **A/B testing framework** for prompt optimization
2. **Multi-stage analysis** for complex leads
3. **Historical data integration** for better predictions
4. **Cost optimization** through prompt efficiency

### Long-Term Vision

1. **Adaptive learning system** that improves over time
2. **Predictive lead scoring** based on conversion patterns
3. **Advanced personalization** engine
4. **Real-time market context** integration

## 📚 Best Practices Summary

### Prompt Engineering Guidelines

1. **Be Specific**: Clear, detailed instructions work better than vague ones
2. **Provide Context**: Include business context, product info, and market conditions
3. **Use Examples**: Few-shot learning improves consistency and accuracy
4. **Structure Output**: JSON format ensures reliable parsing and integration
5. **Test Continuously**: Regular testing against known scenarios and outcomes
6. **Monitor Performance**: Track accuracy, cost, response quality, and user satisfaction
7. **Iterate Based on Data**: Use real conversion data to improve prompts over time

### Red Flags to Monitor

- **Generic responses** that could apply to any lead
- **Inconsistent scoring** for similar lead profiles
- **Missing risk assessment** for obvious red flags
- **Overconfident predictions** without sufficient data
- **High API costs** due to overly long or inefficient prompts
- **Slow response times** affecting user experience

### Success Metrics

- **Accuracy**: 85%+ alignment between AI scores and actual conversion outcomes
- **Consistency**: <10% score variance for similar lead profiles
- **Specificity**: 70%+ of insights are actionable and specific
- **Cost Efficiency**: <$0.05 per lead analysis
- **Response Time**: <5 seconds average analysis time
- **User Satisfaction**: Sales team reports AI insights as valuable 90%+ of the time

The ultimate goal is creating prompts that provide **actionable, accurate, and cost-effective** lead analysis that directly improves sales team efficiency and conversion rates.eness(response: Dict[str, Any]) -> float:
"""Check if all required fields are present and non-empty"""
required_fields = [
'overall_score', 'qualification_status', 'key_insights',
'next_steps', 'recommended_approach'
]

        present_fields = sum(1 for field in required_fields if response.get(field))
        return present_fields / len(required_fields)

    @staticmethod
    def _check_specificity(response: Dict[str, Any]) -> float:
        """Check how specific and detailed the insights are"""
        insights = response.get('key_insights', [])
        if not insights:
            return 0.0

        generic_phrases = ['needs more info', 'requires follow-up', 'potential opportunity']
        specific_insights = [
            insight for insight in insights
            if not any(phrase in insight.lower() for phrase in generic_phrases)
        ]

        return len(specific_insights) / len(insights) if insights else 0.0

````

### 2. Adaptive Prompt Refinement

```python
class AdaptivePromptManager:
    """Continuously improve prompts based on performance"""

    def __init__(self):
        self.prompt_performance_history = {}
        self.successful_patterns = []
        self.failed_patterns = []

    async def get_optimized_prompt(self, lead_data: Dict[str, Any]) -> str:
        """Get the best-performing prompt for this type of lead"""

        lead_profile = self._create_lead_profile(lead_data)

        if lead_profile in self.prompt_performance_history:
            best_prompt = max(
                self.prompt_performance_history[lead_profile],
                key=lambda x: x['success_rate']
            )
            return best_prompt['template']
        else:
            return self._get_default_prompt(lead_data)

    def record_prompt_performance(self, prompt: str, lead_data: Dict[str, Any], outcome: Dict[str, Any]):
        """Record prompt performance for future optimization"""
        lead_profile = self._create_lead_profile(lead_data)

        if lead_profile not in self.prompt_performance_history:
            self.prompt_performance_history[lead_profile] = []

        self.prompt_performance_history[lead_profile].append({
            'prompt_hash': hash(prompt),
            'template': prompt,
            'outcome': outcome,
            'success_rate': outcome.get('accuracy', 0.5),
            'timestamp': datetime.now()
        })
````

## 🎯 Prompt Validation & Testing

### 1. Prompt Testing Framework

```python
class PromptTestSuite:
    """Test prompts against known scenarios"""

    TEST_SCENARIOS = [
        {
            'name': 'high_quality_cto',
            'lead_data': {
                'first_name': 'Alexandra',
                'title': 'Chief Technology Officer',
                'company': 'TechGiant Corp',
                'industry': 'Technology',
                'company_size': '1000+',
                'budget_range': '$100,000+'
            },
            'expected_score_range': (80, 100),
            'expected_status': 'Qualified'
        },
        {
            'name': 'low_quality_student',
            'lead_data': {
                'first_name': 'Student',
                'title': 'Graduate Student',
                'company': 'University',
                'industry': 'Education',
                'budget_range': 'Under $5,000'
            },
            'expected_score_range': (0, 30),
            'expected_status': 'Not Qualified'
        }
    ]

    @staticmethod
    async def run_prompt_tests(prompt_function) -> Dict[str, float]:
        """Run all test scenarios against a prompt"""
        results = []

        for scenario in PromptTestSuite.TEST_SCENARIOS:
            analysis = await GrokService.analyze_with_custom_prompt(
                scenario['lead_data'],
                prompt_function
            )

            score_match = (
                scenario['expected_score_range'][0] <=
                analysis['overall_score'] <=
                scenario['expected_score_range'][1]
            )

            status_match = analysis['qualification_status'] == scenario['expected_status']

            results.append({
                'scenario': scenario['name'],
                'score_accuracy': score_match,
                'status_accuracy': status_match,
                'overall_accuracy': score_match and status_match
            })

        return {
            'total_accuracy': sum(r['overall_accuracy'] for r in results) / len(results),
            'score_accuracy': sum(r['score_accuracy'] for r in results) / len(results),
            'status_accuracy': sum(r['status_accuracy'] for r in results) / len(results),
            'detailed_results': results
        }
```

### 2. Prompt Monitoring & Analytics

```python
class PromptMonitor:
    """Monitor prompt performance in production"""

    @staticmethod
    def log_prompt_metrics(lead_id: int, prompt: str, response: Dict[str, Any], execution_time: float):
        """Log prompt performance metrics"""

        metrics = {
            'lead_id': lead_id,
            'prompt_length': len(prompt),
            'response_quality': PromptQualityAnalyzer.analyze_response_quality(prompt, response),
            'execution_time': execution_time,
            'token_usage': response.get('usage', {}).get('total_tokens', 0),
            'cost_estimate': PromptMonitor._calculate_cost(response),
            'timestamp': datetime.now()
        }

        logger.info(f"Prompt metrics: {metrics}")
        return metrics

    @staticmethod
    def _calculate_cost(response: Dict[str, Any]) -> float:
        """Calculate estimated API cost"""
        tokens = response.get('usage', {}).get('total_tokens', 0)
        cost_per_token = 0.0001  # Approximate cost
        return tokens * cost_per_token
```

## 📊 Recommended Implementation Priority

### Phase 1: Immediate Improvements (Week 1)

1. **Add product context** to existing prompts
2. **Implement industry-specific scoring** weights
3. **Add competitive intelligence** detection
4. **Improve error handling** and fallbacks

### Phase 2: Advanced Features (Week 2-3)

1. **Multi-stage analysis** for complex leads
2. **A/B testing framework** for prompt optimization
3. **Context-aware scoring** with market conditions
4. **Historical performance** integration

### Phase 3: Intelligence Layer (Month 1)

1. **Adaptive prompt selection** based on performance
2. **Continuous learning** from successful conversions
3. **Predictive modeling** for lead scoring
4. **Advanced personalization** strategies

## 🎯 Key Takeaways

### Best Practices for Grok Prompts:

1. **Be Specific**: Clear, detailed instructions work better than vague ones
2. **Provide Context**: Include business context, product info, and market conditions
3. **Use Examples**: Few-shot learning improves consistency
4. **Structure Output**: JSON format ensures reliable parsing
5. **Test Continuously**: Regular testing against known scenarios
6. **Monitor Performance**: Track accuracy, cost, and response quality
7. **Iterate Based on Data**: Use real conversion data to improve prompts

### Red Flags to Watch For:

- **Generic responses** that could apply to any lead
- **Inconsistent scoring** for similar lead profiles
- **Missing risk assessment** for obvious red flags
- **Overconfident predictions** without sufficient data
- **High API costs** due to overly long prompts

The goal is to create prompts that provide **actionable, accurate, and cost-effective** lead analysis that directly improves your sales team's efficiency and conversion rates.
