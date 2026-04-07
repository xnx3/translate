package cn.zvo.translateai.model;

import java.util.ArrayList;
import java.util.List;

/**
 * 单个审查维度的结果
 */
public class AuditDimension {
    private String id;
    private String name;
    private int score;
    private String detail;
    private List<String> issues = new ArrayList<>();
    private List<String> fixes = new ArrayList<>();

    public AuditDimension() {}

    public AuditDimension(String id, String name) {
        this.id = id;
        this.name = name;
        this.score = 0;
        this.detail = "";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public List<String> getIssues() { return issues; }
    public void setIssues(List<String> issues) { this.issues = issues; }

    public List<String> getFixes() { return fixes; }
    public void setFixes(List<String> fixes) { this.fixes = fixes; }

    public boolean isPassed() { return score >= 10; }
}
