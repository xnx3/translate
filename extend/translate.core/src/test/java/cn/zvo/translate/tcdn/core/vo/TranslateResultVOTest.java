package cn.zvo.translate.tcdn.core.vo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 冻结原有 JSON 响应契约，并验证混合数组及可选 usage 的序列化结构。
 * 此处只测试返回对象，不代表翻译流程已经接入 usage 计算或混合翻译。
 */
public class TranslateResultVOTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test
    public void defaultResponseKeepsLegacyNullFields() throws Exception {
        assertJson("{\"result\":1,\"info\":\"成功\",\"from\":null,\"to\":null,"
                + "\"text\":null,\"original\":null}", new TranslateResultVO());
    }

    @Test
    public void ordinarySuccessKeepsStringsAndEscapes() throws Exception {
        TranslateResultVO result = new TranslateResultVO();
        result.setFrom("chinese_simplified");
        result.setTo("english");
        result.setInfo("success");
        result.setText(Arrays.<Object>asList("Hello", "", " \t ", "😀", "\"\\\n"));
        List<String> original = Arrays.asList("你好", "", " \t ", "😀", "\"\\\n");
        result.setOriginal(original);
        assertSame(original, result.getOriginal());

        assertJson("{\"result\":1,\"info\":\"success\",\"from\":\"chinese_simplified\",\"to\":\"english\","
                + "\"text\":[\"Hello\",\"\",\" \\t \",\"😀\",\"\\\"\\\\\\n\"],"
                + "\"original\":[\"你好\",\"\",\" \\t \",\"😀\",\"\\\"\\\\\\n\"]}", result);
    }

    @Test
    public void failureKeepsOriginalStringArrays() throws Exception {
        TranslateResultVO result = new TranslateResultVO();
        result.setFrom("auto");
        result.setTo("english");
        result.setBaseVO(0, "翻译失败");
        result.setText(Arrays.<Object>asList("你好", "原文"));
        result.setOriginal(Arrays.<Object>asList("你好", "原文"));

        assertJson("{\"result\":0,\"info\":\"翻译失败\",\"from\":\"auto\",\"to\":\"english\","
                + "\"text\":[\"你好\",\"原文\"],\"original\":[\"你好\",\"原文\"]}", result);
    }

    @Test
    public void emptyArraysRemainArrays() throws Exception {
        TranslateResultVO result = new TranslateResultVO();
        result.setText(Collections.<Object>emptyList());
        result.setOriginal(Collections.<Object>emptyList());

        assertJson("{\"result\":1,\"info\":\"成功\",\"from\":null,\"to\":null,"
                + "\"text\":[],\"original\":[]}", result);
    }

    @Test
    public void controllerClearedOriginalRemainsPresentAndNull() throws Exception {
        TranslateResultVO result = new TranslateResultVO();
        result.setFrom("auto");
        result.setTo("english");
        result.setText(Arrays.<Object>asList("Hello"));
        result.setOriginal(Arrays.<Object>asList("你好"));
        // 普通 translate.json 的 Controller 会在返回前清除此字段。
        result.setOriginal(null);

        assertJson("{\"result\":1,\"info\":\"成功\",\"from\":\"auto\",\"to\":\"english\","
                + "\"text\":[\"Hello\"],\"original\":null}", result);
    }

    @Test
    public void accountNotActivatedCodeRemains401() throws Exception {
        assertEquals(401, TranslateResultVO.ERROR_ACCOUNT_NOT_ACTIVATED);
        TranslateResultVO result = new TranslateResultVO();
        result.setBaseVO(TranslateResultVO.ERROR_ACCOUNT_NOT_ACTIVATED, "账户未激活");

        assertJson("{\"result\":401,\"info\":\"账户未激活\",\"from\":null,\"to\":null,"
                + "\"text\":null,\"original\":null}", result);
    }

    @Test
    public void usageIsOptionalAndPreservesLongIntegers() throws Exception {
        TranslateResultVO result = new TranslateResultVO();
        assertFalse(json(result).has("usage"));

        Map<String, Long> usage = new LinkedHashMap<String, Long>();
        usage.put("prompt_tokens", 2147483648L);
        usage.put("completion_tokens", 2L);
        usage.put("total_tokens", 2147483650L);
        result.setUsage(usage);
        JsonNode serialized = json(result).get("usage");
        assertEquals(JSON.readTree("{\"prompt_tokens\":2147483648,\"completion_tokens\":2,"
                + "\"total_tokens\":2147483650}"), serialized);
        assertTrue(serialized.get("prompt_tokens").isIntegralNumber());
        assertEquals(2147483648L, serialized.get("prompt_tokens").longValue());
        assertEquals(2147483650L, serialized.get("total_tokens").longValue());

        result.setUsage(null);
        assertFalse(json(result).has("usage"));
    }

    @Test
    public void mixedArraysKeepGroupObjectsAndOriginalMetadata() throws Exception {
        String original = "[\"你好\",{\"context\":{\"before\":\"这是一次问候。\\n\"},"
                + "\"words\":[{\"text\":\"早上\",\"weight\":1},{\"text\":\"好\",\"weight\":0}]}]";
        String translated = "[\"Hello\",{\"words\":[{\"text\":\"morning\"},{\"text\":\"Good\"}],"
                + "\"order\":[1,0]}]";
        TranslateResultVO result = new TranslateResultVO();
        result.setFrom("auto");
        result.setTo("english");
        result.setOriginal(JSON.readValue(original, new TypeReference<List<Object>>() { }));
        result.setText(JSON.readValue(translated, new TypeReference<List<Object>>() { }));

        assertJson("{\"result\":1,\"info\":\"成功\",\"from\":\"auto\",\"to\":\"english\","
                + "\"text\":" + translated + ",\"original\":" + original + "}", result);
        JsonNode serialized = json(result);
        assertTrue(serialized.get("text").get(0).isTextual());
        assertTrue(serialized.get("text").get(1).isObject());
        assertFalse(serialized.has("order"));
        assertEquals(JSON.readTree("[1,0]"), serialized.get("text").get(1).get("order"));
    }

    @Test
    public void debugIsNotAResponseProperty() throws Exception {
        assertFalse(json(new TranslateResultVO()).has("debug"));
        for (PropertyDescriptor property : Introspector.getBeanInfo(TranslateResultVO.class).getPropertyDescriptors()) {
            assertFalse("debug must not be a bean property", "debug".equals(property.getName()));
        }
    }

    private static JsonNode json(TranslateResultVO result) throws Exception {
        return JSON.readTree(JSON.writeValueAsString(result));
    }

    private static void assertJson(String expected, TranslateResultVO result) throws Exception {
        assertEquals(JSON.readTree(expected), json(result));
    }
}
