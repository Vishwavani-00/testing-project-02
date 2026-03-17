
---

# **PRD – Natural Language Query (NLQ) Application**

## **Objective**

Enable users to query structured data using natural language and receive **instant insights (SQL + charts + summary)**.

---

## **Problem Statement**

Business users depend on analysts for data queries, causing delays and inefficiencies.

---

## **Solution**

An NLQ-based application that converts user questions into **SQL queries**, executes them, and returns **visual + textual insights**.

---

## **Key Features**

* Chat-based query interface
* NL → SQL conversion
* Auto-generated charts (bar/line/table)
* Insight summaries
* Query history

---

## **Users**

* Business teams
* Analysts
* Leadership

---

## **Core Flow**

User Query → NL Processing → SQL Generation → DB Execution → Chart + Summary Output

---

## **Tech Stack**

* Frontend: React / Streamlit
* Backend: Python (FastAPI)
* LLM: OpenAI / Gemini
* Database: PostgreSQL / BigQuery

---

## **Functional Requirements**

* Accept natural language queries
* Generate accurate SQL
* Return results with visualization
* Provide summary insights

---

## **Non-Functional Requirements**

* Response time < 5 sec
* Accuracy > 85%
* Secure data access (RBAC)

---

## **Risks**

* Incorrect query generation → Add validation
* Ambiguous queries → Clarification prompts

---

## **Success Metrics**

* Query success rate
* Response latency
* User adoption
* Reduction in manual reporting

---

## **Outcome**

Faster decision-making with **self-serve analytics** and reduced dependency on data teams.

---

